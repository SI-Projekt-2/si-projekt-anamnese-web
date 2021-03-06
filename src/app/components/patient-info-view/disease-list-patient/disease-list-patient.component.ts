import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core'
import { v4 as uuid } from 'uuid'
import { DiseaseService } from '../../services/disease.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { SessionService } from '../../../core/authentification-and-authority/session.service'
import { IDisease } from '../../../model/disease.interface'
import { DiseaseModalComponent } from '../../../shared/dialogs/disease-modal/disease-modal.component'
import { DeleteConfirmationComponent } from '../../../shared/dialogs/delete-confirmation-modal/delete-confirmation.component'
import { IDeleteConfirmation } from '../../../model/delete-confirmation.interface'
import { IPerson } from '../../../model/person.interface'

@Component({
  selector: 'app-disease-list-patient',
  templateUrl: './disease-list-patient.component.html',
  styleUrls: ['./disease-list-patient.component.css']
})
export class DiseaseListPatientComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['#', 'preExistingIllness', 'undergoneSurgery', 'surgeryReason', 'action']
  diseasesList: Array<IDisease> = []
  fromInit: boolean = true
  @Input() currentUser: IPerson = <IPerson>{}

  constructor(
    private diseaseService: DiseaseService,
    private snackBar: MatSnackBar,
    private sessionService: SessionService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.listPersonDiseases()
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    console.log(changes)

    if (changes.currentUser && this.currentUser && this.currentUser.id) {
      if (!this.fromInit) {
        this.listPersonDiseases()
      }
    }

  }

  onAddNewOrEdit(disease?: IDisease): void {
    const dialogRef = this.dialog.open(DiseaseModalComponent, {
      width: '750px',
      data: {update: disease, parent: 'patient', patient: this.currentUser}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.answer) {
        this.listDisease()
      }
    })
  }

  onDelete(disease: IDisease): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: <IDeleteConfirmation>{entityType: 'Disease', entityName: ''}
    })

    dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.deleteDisease(disease.id)
      }
    })
  }


  private listDisease(): void {
    this.diseaseService.getAll().subscribe((diseases: any) => {
        this.diseasesList = diseases
      },
      err => {
        console.log('Error in DiseaseListPatientComponent.listDisease()')
        console.log(err)
        this.snackBar.open('Could not fetch diseases', 'Close', {
          duration: 4000
        })
      }
    )
  }

  private deleteDisease(diseaseId: uuid): void {
    this.diseaseService.delete(diseaseId).subscribe(() => {
        this.listDisease()
      },
      err => {
        console.log('Error in DiseaseListPatientComponent.deleteDisease()')
        console.log(err)
        this.snackBar.open('Could not delete disease', 'Close', {
          duration: 4000
        })
      }
    )
  }

  private listPersonDiseases(): void {
    let patientId: uuid = ''
    if (this.currentUser && this.currentUser.id) {
      patientId = this.currentUser.id
    } else {
      patientId = this.sessionService.getUserId()
    }
    this.diseaseService.getAllByPersonId(patientId).subscribe((diseases: Array<IDisease>) => {
        console.log('diseases fetched')
        this.fromInit = false
        this.diseasesList = diseases
      },
      err => {
        console.log('Error in DiseaseListPatientComponent.listPersonDiseases()')
        console.log(err)
        this.snackBar.open('Could not fetch diseases', 'Close', {
          duration: 4000
        })
      }
    )
  }

}
