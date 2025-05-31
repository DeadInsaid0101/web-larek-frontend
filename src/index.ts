import './scss/styles.scss';

import { LarekApi } from './components/base/LarekApi';
import { AppData } from './components/Model/AppData';
import { Page } from './components/View/Page';
import { Card } from './components/View/Card';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate, ensureAllElements } from './utils/utils';
import { IOrder, IOrderForm, IProductItem } from './types';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/View/Modal';
import { CardPreview } from './components/View/CardPreview';
import { Basket, IBasketItem } from './components/View/Basket';
import { Form, IFormState } from './components/View/Form';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';

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
const success = new Success(successContainer)






api.getProductCatalog()
  .then((items: IProductItem[]) => {
    model.setCatalog(items)
    // console.log('yes')
    // console.log(items)

    const cardElements = items.map(item => {

      const cardElement = cloneTemplate<HTMLButtonElement>('#card-catalog')


      const card = new Card(cardElement, events)
      card.render({
        title: item.title,
        category: item.category,
        image: item.image,
        price: item.price,
        description: item.description,
        id: item.id
      });


      cardElement.addEventListener('click', () => {
        //   console.log('fff')
        events.emit('preview:changed', item);
        //     console.log(item)
      })
      return cardElement;
    });


    page.catalog = cardElements;


  })


  .catch(() => {
    console.log('error');
  });



events.on<IProductItem>('preview:changed', item => {

  const previewContainer = cloneTemplate<HTMLElement>('#card-preview');
  const cardPreview = new CardPreview(previewContainer, events)

  cardPreview.render({
    title: item.title,
    category: item.category,
    image: item.image,
    price: item.price,
    description: item.description,
    id: item.id
  });

  const addButtonToBasket = cardPreview._cardButton
  addButtonToBasket.addEventListener('click', () => {
    events.emit('basket:add', item)
    //  console.log(item)
  })
  modal.render(previewContainer);
  modal.open();

  //console.log(modal.isActive)
});



events.on<IProductItem>('basket:add', item => {
  model.setProductToBasket(item)
  events.emit('basket:changed', model.basket);
  modal.close()
  // console.log(model.basket)
})



events.on<IBasketItem>('basket:remove', item => {
  model.removeProductToBasket(item);
  events.emit('basket:changed', model.basket);
});




events.on<IBasketItem[]>('basket:changed', items => {
  if (modal.isActive) {
    basket.render(items);
    const total = model.getTotal(items)
    basket.setTotal(total);
    basket.setEmptyMessage(items)

    //    console.log(items)
    if (items.length === 0) {
      basket.continueButton.disabled = true
    }
    else {
      basket.continueButton.disabled = false
    }
    basket.setRemoveHandler(item => {
      model.removeProductToBasket(item)
      events.emit('basket:remove', items);

      //  console.log(items)
    }, model.basket)

  }
  page.counter = items.length;

})





const basketButton = page._basket
basketButton.addEventListener('click', () => {
  events.emit('basket:open', model.basket)
})

events.on<IBasketItem[]>('basket:open', item => {
  modal.render(basketElement)
  //console.log('dd')
  modal.open()
  basket.setEmptyMessage(item)
  if (item.length === 0) {
    basket.continueButton.disabled = true
  }
  else {
    basket.continueButton.disabled = false
  }

  basket.continueButton.addEventListener('click', () => {
    events.emit('order:open', item)
    //   console.log('22')
    //   console.log(item)

  })


})

events.on<IBasketItem[]>('order:open', items => {
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






events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { address, payment, email, phone } = errors;
  order.valid = !address && !payment;
  contacts.valid = !phone && !email;
  order.errors = Object.values({ address, payment }).filter(i => !!i).join(' и ');
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join(' и ');
});


events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  model.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  model.setContactsField(data.field, data.value);
});


events.on('payment:change', (item: HTMLButtonElement) => {
  model.order.payment = item.name;
  // console.log(model.order)
})

events.on<IOrder>('order:submit', items => {
  model.order.total = model.getTotal(model.basket)

  model.addProductIdToOrder()

  // console.log(model.order)
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

events.on<IOrder>('contacts:submit', () => {
  api.orderProducts(model.order)
    .then(result => {

      modal.close()
      modal.render(successContainer)
      modal.open()
      //console.log(result)
      success.setTotal(result.total)
      model.clearBasket()
      page.counter = 0;
      basket.setTotal(0)
      success._button.addEventListener('click', () => {
        modal.close()
      })
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