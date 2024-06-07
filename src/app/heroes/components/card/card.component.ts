import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.inteface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
  styles: ``
})
export class CardComponent implements OnInit{

  @Input()
  public hero!: Hero;

  ngOnInit(): void {
    if(!this.hero) throw new Error('Hero is required');
  }
}
