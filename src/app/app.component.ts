import { Component } from '@angular/core';
import { TechService } from './Component/tech.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'api-calculator';
  teches: any[] = [];
  hora: number = 0;
  valueId: string = '';
  week: number = 0;

  horaTotal: number = 0;
  horaExtra: number = 0;
  horasNoche: number = 0;
  horasDomingo: number = 0;
  isFiltered: boolean = false;
  isTotal: boolean = true;

  constructor(public techList: TechService) {}
  ngOnInit() {
    this.getData();
    this.isTotal = true;
    this.isFiltered = false;
  }

  getData() {
    this.techList.getAll().subscribe((response: any) => {
      this.teches = response;
      this.isTotal = true;
      this.isFiltered = false;
    });
  }

  delete(id: string) {
    this.techList.delete(id).subscribe((response) => {
      let item = id.indexOf(id, 0);
      this.getData();
    });
  }

  getFilter() {
    this.techList
      .getAllByIdAndWeek(this.valueId, this.week)
      .subscribe((response) => {
        //Atributos principales del array
        this.teches = response;
        this.isTotal = false;
        this.isFiltered = true;

        //Atributos necesarios para calcular las horas como reglas de negocio
        this.horaTotal = 0;
        this.horaExtra = 0;
        this.horasNoche = 0;
        this.horasDomingo = 0;
        
        for (let index = 0; index < this.teches.length; index++) {
          var tiempo = 0;
          const inicio = new Date(this.teches[index].horaInicial);
          const final = new Date(this.teches[index].horaFinal);

          // Calcular horas normales
          if (this.horaTotal < 48) {
            tiempo = this.teches[index].horas;
            this.horaTotal += tiempo;
          }
          //Calcular horas extra
          if (this.horaTotal > 48) {
            tiempo = this.teches[index].horas;
            this.horaExtra += tiempo;
          }
          // Calcular horas dominicales
          if (inicio.getDay() == 0 || final.getDay() == 0) {
            tiempo = tiempo = this.teches[index].horas;
            this.horasDomingo += tiempo;
          }

          // Calculo de horas nocturnas
          if (inicio.getHours() >= 20 || inicio.getHours() < 7) {
            tiempo = tiempo = this.teches[index].horas;
            this.horasNoche += tiempo;
          }
        }

        // Retorno de horas totales en los distintos casos
        this.horaTotal;
        this.horaExtra;
        this.horasNoche;
        this.horasDomingo;
        console.log(this.teches);
      });
  }

  getClick(event: any) {
    var ini = new Date(event.horaInicial);
    var final = new Date(event.horaFinal);
    var hdiff = Math.abs(
      ((final.getTime() - ini.getTime()) % 86400000) / 3600000
    );
    if (hdiff < 1) {
      hdiff =
        Math.abs(((final.getTime() - ini.getTime()) % 86400000) % 3600000) /
        60000;
      alert('El total trabajado es de ' + hdiff.toFixed(1) + ' minutos');
    } else {
      alert('Las horas trabajadas son: ' + hdiff.toFixed(1) + ' h');
    }
  }
}
