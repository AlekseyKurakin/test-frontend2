import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private renderer: Renderer2;
  private messageElement: HTMLElement;

  messageColorByType = {
    'success': '#66bb6a',
    'failure': '#ef7da0'
  }

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  showMessage(type: 'success'| 'failure', message: string) {

    const container = this.renderer.createElement('div');
    this.messageElement = this.renderer.createElement('div');
    this.messageElement.textContent = message;
    console.log(this.messageElement.textContent)
    this.renderer.addClass(this.messageElement, 'success-message');
    this.renderer.setStyle(container, 'position', 'fixed');
    this.renderer.setStyle(container, 'top', '0');
    this.renderer.setStyle(container, 'left', '0');
    this.renderer.setStyle(container, 'width', '100%');
    this.renderer.setStyle(container, 'height', '100%');
    this.renderer.setStyle(container, 'display', 'flex');
    this.renderer.setStyle(container, 'align-items', 'center');
    this.renderer.setStyle(container, 'justify-content', 'center');
    this.renderer.setStyle(this.messageElement, 'background-color', this.messageColorByType[type]);
    this.renderer.setStyle(this.messageElement, 'white-space', 'pre-line');
    this.renderer.setStyle(this.messageElement, 'text-align', 'center');
    this.renderer.setStyle(this.messageElement, 'color', 'white');
    this.renderer.setStyle(this.messageElement, 'padding', '20px 30px');
    this.renderer.setStyle(this.messageElement, 'border-radius', '6px');
    this.renderer.setStyle(this.messageElement, 'box-shadow', '0px 10px 15px #4CAF505C');
    this.renderer.appendChild(container, this.messageElement);
    document.body.appendChild(container);
  }
}
