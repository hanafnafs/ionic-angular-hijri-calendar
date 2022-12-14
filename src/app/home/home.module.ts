import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { CalendarDemoComponent } from '../components/calendar-demo/calendar-demo.component';
import { ChunkPipe } from '../components/calendar-demo/chunk-pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, CalendarDemoComponent, ChunkPipe],
  exports:[ChunkPipe]
})
export class HomePageModule {}
