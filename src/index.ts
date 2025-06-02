import './scss/styles.scss';

import { LarekApi } from './components/base/LarekApi';
import { AppData } from './components/Model/AppData';
import { Page } from './components/View/Page';
import { Card } from './components/View/Card';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IOrder, IOrderResult, IProductItem } from './types';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/View/Modal';
import { CardPreview } from './components/View/CardPreview';
import { Basket } from './components/View/Basket';
import { Form } from './components/View/Form';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';
import { CardBasket } from './components/View/CardBasket';

const modalContainer = ensureElement<HTMLElement>('#modal-container')
const basketElement = cloneTemplate<HTMLElement>('#basket')
const orderContainer = cloneTemplate<HTMLFormElement>('#order')
const contactsContainer = cloneTemplate<HTMLFormElement>('#contacts')
const successContainer = cloneTemplate<HTMLElement>('#success')



const api = new LarekApi(CDN_URL, API_URL)
const events = new EventEmitter()
const mainContainer = ensureElement<HTMLElement>('.page');
const page = new Page(mainContainer, events)
const model = new AppData({}, events)
const modal = new Modal(modalContainer, events)
const basket = new Basket(basketElement, events)
const form = new Form(orderContainer, events)
const order = new Order(orderContainer, events)
const contacts = new Contacts(contactsContainer, events)
const success = new Success(successContainer, {
  onClick: () => {
    modal.close()
  }
})






api.getProductCatalog()
  .then((items: IProductItem[]) => {
    model.setCatalog(items)
    // console.log('yes')
    // console.log(items)
  })
  .catch(() => {
    console.log('error');
  });


events.on<IProductItem[]>('items:changed', items => {
  const cardElements = items.map(item => {
    const cardElement = cloneTemplate<HTMLButtonElement>('#card-catalog')

    const card = new Card(cardElement, events, {
      onClick: () => {
        events.emit('preview:changed', item)
      }
    })

    card.render({
      title: item.title,
      category: item.category,
      image: item.image,
      price: item.price,
      description: item.description,
      id: item.id
    });

    return cardElement;
  });

  page.catalog = cardElements;
});



events.on<IProductItem>('preview:changed', item => {

  const previewContainer = cloneTemplate<HTMLElement>('#card-preview');
  const cardPreview = new CardPreview(previewContainer, events, {
    onClick: () => {
      events.emit('basket:add', item)
    }
  })

  cardPreview.render({
    title: item.title,
    category: item.category,
    image: item.image,
    price: item.price,
    description: item.description,
    id: item.id
  });


  modal.render(previewContainer);
  modal.open();

  if (item.id && model.basket.some(product => product.id === item.id)) {
    cardPreview.cardButton.disabled = true
  }
  //console.log(modal.isActive)
});


events.on<IProductItem>('basket:add', item => {
  model.setProductToBasket(item)

  modal.close()
  // console.log(model.basket)
})

events.on<IProductItem[]>('basket:changed', items => {
  if (modal.isActive) {

    const basketItems = items.map((item, index) => {
      const basketItem = cloneTemplate<HTMLElement>('#card-basket');
      const cardBasket = new CardBasket(basketItem, {
        onClick: () => events.emit('basket:remove', item)
      });

      cardBasket.render({
        title: item.title,
        price: item.price,
        index: index + 1
      })

      return basketItem;
    });


    basket.render({
      items: basketItems,
      total: model.getTotal()
    });

    basket.setEmptyMessage(items)

    //    console.log(items)
    if (items.length === 0 || (items.length === 1 && items[0].price === null)) {
      basket.continueButton.disabled = true
    }
    else {
      basket.continueButton.disabled = false
    }




  }


  page.counter = items.length;

})


events.on<IProductItem>('basket:remove', item => {
  model.removeProductFromBasket(item)
  events.emit('basket:changed', model.basket)


})

events.on<IProductItem[]>('basket:open', () => {
  modal.render(basketElement)
  //console.log('dd')
  modal.open()
  basket.setEmptyMessage(model.basket)
  if (model.basket.length === 0 || (model.basket.length === 1 && model.basket[0].price === null)) {
    basket.continueButton.disabled = true
  }
  else {
    basket.continueButton.disabled = false
  }
})

events.on<IProductItem[]>('order:open', () => {
  // console.log('uu')
  modal.close();

  const orderContainer = order.render({
    payment: 'card',
    address: '',
    valid: false,
    errors: []
  });

  modal.render(orderContainer);
  modal.open();
  //console.log(model.order)
})

events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { address, payment, email, phone } = errors;
  order.valid = !address && !payment;
  contacts.valid = !phone && !email;
  order.errors = Object.values({ address, payment }).filter(i => !!i).join(' и ');
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join(' и ');
});


events.on(/^order\..*:change/, (data: { field: keyof IOrder, value: string }) => {
  model.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrder, value: string }) => {
  model.setContactsField(data.field, data.value);
});


events.on('payment:change', (item: HTMLButtonElement) => {
  model.setPayment('payment', item.name);


})

events.on<IOrder>('payment:save', paymentData => {
  order.payment = paymentData.payment;
});


events.on<IOrder>('order:submit', () => {
  //console.log(model.order)
  modal.close()
  const contactsContainer = contacts.render({
    email: '',
    phone: '',
    valid: false,
    errors: []
  });

  modal.render(contactsContainer)
  modal.open()
})

events.on<IOrderResult>('contacts:submit', () => {
  const orderTotal = model.getOrder()
  const basketItems = model.getBasket()

  const orderResult: IOrderResult = {
    ...orderTotal,
    items: basketItems.filter(item => item.price !== null).map(item => item.id),
    total: basketItems.reduce((sum, item) => sum + (item.price || 0), 0),
  };
  console.log(orderResult)
  api.orderProducts(orderResult)
    .then(result => {

      modal.close()
      modal.render(successContainer)
      modal.open()
      //   console.log(orderResult)
      success.setTotal(result.total)
      model.clearBasket()
      page.counter = 0;
      basket.setTotal(0)
      model.validateClear()
    })

    .catch(() => {
      console.log('error');
    });

})


events.on('modal:open', () => {
  page.locked = true
})

events.on('modal:close', () => {
  page.locked = false
})