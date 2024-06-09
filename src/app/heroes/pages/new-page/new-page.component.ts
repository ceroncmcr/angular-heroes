import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter, of, switchMap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Hero, Publisher } from '../../interfaces/hero.inteface';
import { HeroesService } from '../../services/hero.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:               new FormControl(''),
    superhero:        new FormControl('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  constructor( private heroesService : HeroesService,
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private snackbar : MatSnackBar,
    private dialog : MatDialog,
  ) { }
  ngOnInit(): void {
    if( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) )
      )
      .subscribe( hero => {
        if( !hero ) return this.router.navigate(['/heroes/list']);

        this.heroForm.reset( hero );

        return;
      });
  }

  get currentHero() : Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {

    if( !this.heroForm.valid ) return;

    if( this.currentHero.id ){
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar( `${ hero.superhero } ha sido actualizado!` );
          // this.heroForm.reset();
        });

      return;
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        // TODO: mostrar snackbar, y navegar a heroes/edit/ hero.id
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar( `${ hero.superhero } ha sido agregado!` );

        // this.heroForm.reset();
      });
    return;
  }

  onDeleteHero(): void {
    if( !this.currentHero.id ) throw Error('Hero id es requerido');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter( result => result),
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id ) ),
        filter( wasDeleted => wasDeleted ),
      )
      .subscribe(() => {

        this.router.navigate(['/heroes/list']);
      });

    // dialogRef.afterClosed().subscribe(result => {
    //   if( !result ) return;

    //   this.heroesService.deleteHeroById( this.currentHero.id )
    //     .subscribe( resp => {

    //       if(resp)
    //         this.router.navigate(['/heroes/list']);
    //     });
    // });
  }

  showSnackbar( message: string ): void {
    this.snackbar.open( message, 'Ok', {
      duration: 2500
    });
  }
}
