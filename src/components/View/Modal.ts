import { Component } from "./Component"
import { ensureElement } from "../../utils/utils"
import { IEvents } from "../base/events"


export class Modal extends Component<unknown> {
   protected modalElement: HTMLElement
   protected containerElement: HTMLElement
   protected closeButton: HTMLElement
   isActive: boolean = false
   protected events: IEvents;

   constructor(container: HTMLElement, events: IEvents) {
      super(container)

      this.events = events;
      this.modalElement = container;
      this.containerElement = ensureElement<HTMLElement>('.modal__content', container);
      this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

      this.modalElement.addEventListener('click', (event) => {
         if (event.target === this.modalElement) {
            this.close()
         }
      })
      this.closeButton.addEventListener('click', () => {
         this.close()
      })
   }


   open(): void {

      this.modalElement.classList.add('modal_active')
      this.isActive = true
      this.events.emit('modal:open');
   }

   close(): void {
      this.containerElement.innerHTML = ''
      this.modalElement.classList.remove('modal_active');
      this.isActive = false
      this.events.emit('modal:close');
   }

   render(content: HTMLElement): HTMLElement {
      this.containerElement.append(content)
      return this.containerElement
   }
}

