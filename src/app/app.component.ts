import { Component, ElementRef, OnDestroy, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { interval, Subscription, take } from "rxjs";
import { MessageService } from "../services/message.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private gameSubscription = Subscription.EMPTY;

  @ViewChildren('dynamicButton') dynamicButtons: QueryList<ElementRef>;

  matrixColsAndRows: number[] = Array.from({ length: 10 }, (_, index) => index);
  form: FormGroup;

  score = {
    computer: 0,
    user: 0
  }
  randomNumber = -1;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private renderer: Renderer2,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      timeMsControl: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    })
  }

  startGame() {
    let randomNumbers: number[] = Array.from({ length: 100 }, (_, index) => index);
    const timeMs = this.form.get('timeMsControl')?.value;

    const source$ = interval(timeMs);
    this.gameSubscription = source$.pipe(
      take(100)
    ).subscribe(() => {
      if (this.randomNumber !== -1) {
        const randomButton = this.dynamicButtons.get(this.randomNumber);
        this.renderer.setStyle(randomButton.nativeElement, 'background', '#ff4500')
        this.score.computer++;
        if (this.score.computer === 10) {
          this.endGame();
        }
      }

      this.randomNumber = randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
      randomNumbers.splice(randomNumbers.indexOf(this.randomNumber),1)

      const randomButton = this.dynamicButtons.get(this.randomNumber);
      this.renderer.setStyle(randomButton.nativeElement, 'background', '#ffff00')
    });
  }

  onUserClick(id: number) {
    if (id === this.randomNumber) {
      const selectedButton = this.dynamicButtons.get(id);
      this.renderer.setStyle(selectedButton.nativeElement, 'background', '#228b22')
      this.randomNumber = -1;
      this.score.user++;
      if (this.score.user === 10) {
        this.endGame();
      }
    }
  }

  endGame() {
    this.gameSubscription.unsubscribe();

    /*
    There can be implemented buttons close/retry for popup message, but they weren't in the description,
    so I decided to not implement them rn, and add as an improvement if it will be requested by owner
     */
    this.messageService.showMessage(
      this.score.user > this.score.computer ? "success" : 'failure',
      `Game over! \nUser: ${this.score.user} / Computer: ${this.score.computer}`)
  }

  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }
}
