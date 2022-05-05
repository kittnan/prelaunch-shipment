import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from 'app/api.service';
import Swal from 'sweetalert2';
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';

@Component({
  selector: 'app-pattern-manage',
  templateUrl: './pattern-manage.component.html',
  styleUrls: ['./pattern-manage.component.css']
})
export class PatternManageComponent implements OnInit {

  constructor(
    private api: ApiService,
    private alertSwal: AlertServiceService,
    private auth: AuthGuardService

  ) { }

  Pattern = [];
  // PatternList = [];
  DigitList = [];
  MasterPatternList: any
  ModelMaster: any;
  patternGuide = ["CustomerNo", "ModelCode", "Lot", "Serials", "-", "/", ",", ""]
  PatternName = new FormControl(null, Validators.required)

  PatternId = new FormControl(null, Validators.required)

  // ? toggle
  toggleAddPattern: boolean = false
  toggleShowPattern: boolean = false
  toggleEditPattern: boolean = false

  patternUse: any

  public get summaryDigit(): string {
    const temp1 = this.Pattern.reduce((prev, now) => {
      return prev + Number(now.Digit)
    }, 0)
    return temp1
  }


  async ngOnInit(): Promise<void> {
    this.auth.CheckAuth()
    this.MasterPatternList = await this.getPattern();
    this.ModelMaster = await this.getModelMaster();
  }
  getPattern() {
    return new Promise((resolve) => {
      this.api.getPattern().subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  getModelMaster() {
    return new Promise((resolve) => {
      this.api.getModelMasters().subscribe((data: any) => {
        resolve(data)
      })
    })
  }

  onClickButtonAddPattern() {
    this.Pattern = []
    this.PatternName.reset()
  }

  onChangeMasterPattern() {
    const result = this.MasterPatternList.find(item => item._id == this.PatternId.value)
    if (result) {
      // this.PatternList = result.Value
      // this.DigitList = result.Value.map(r => r.Digit)
      this.PatternName.setValue(result.PatternName)
      this.Pattern = result.Value
      if (result.patternUse.length > 0) {
        this.patternUse = true
      }else{
        this.patternUse = false
      }

    }

  }
  onClickMasterDeletePattern() {
    if (this.PatternId.valid) {
      Swal.fire({
        title: 'Do you want to delete?',
        icon: 'question',
        text: `delete pattern: ${this.PatternName.value}`,
        showConfirmButton: true,
        showCancelButton: true
      }).then(async (r) => {
        if (r.isConfirmed) {

          const resultCheck = await this.checkDeletePattern(this.PatternId.value)
          if (!resultCheck) {
            const result: any = await this.deleteMasterPattern();
            if (result.deletedCount === 1) {
              this.MasterPatternList = await this.getPattern();
              this.PatternId.reset();
              this.PatternName.reset()
              this.clearToggleAll()
              this.alertSwal.alert('success', 'Success')

            } else {
              this.alertSwal.alert('error', 'Some thing it wrong!!')

            }
          } else {
            this.alertSwal.alert('error', 'your pattern is using')
          }


        }
      })
    } else {
      this.alertSwal.alert('error', 'Please select pattern')
    }
  }
  checkDeletePattern(pattern) {
    return new Promise((resolve) => {
      const temp = this.ModelMaster.find(i => i.PatternLabelId == pattern)
      resolve(temp)
    })
  }
  deleteMasterPattern() {
    return new Promise((resolve) => {
      this.api.deletePattern(this.PatternId.value).subscribe((data: any) => {
        resolve(data)
      })
    })
  }

  onClickMasterEditPattern() {
    if (this.PatternId.valid) {
      const result = this.MasterPatternList.find(i => i._id == this.PatternId.value)
      this.Pattern = result.Value
    } else {
      this.alertSwal.alert('error', 'Please select pattern')

      this.toggleEditPattern = false
    }

  }
  manageToggle(name) {
    switch (name) {
      case 'add':
        this.toggleAddPattern = true
        this.toggleEditPattern = false
        this.toggleShowPattern = false
        break;
      case 'edit':
        this.toggleAddPattern = false
        this.toggleEditPattern = true
        this.toggleShowPattern = false
        break;
      case 'show':
        this.toggleAddPattern = false
        this.toggleEditPattern = false
        this.toggleShowPattern = true
    }
  }
  clearToggleAll() {
    this.toggleAddPattern = false
    this.toggleShowPattern = false
    this.toggleEditPattern = false
  }
  onAddPatternList() {
    // this.PatternList.push('')
    this.Pattern.push({
      Name: "",
      Digit: ""
    })
  }
  onChangePatternName(e, index) {
    const value = e.target.value
    this.Pattern[index].Name = value
  }
  onChangeDigitList(e, index) {
    const value = e.target.value
    this.Pattern[index].Digit = value

  }
  onDeletePatternList(index) {
    // this.PatternList.splice(index, 1)
    // this.DigitList.splice(index, 1)
    this.Pattern.splice(index, 1)
  }

  async onSubmit() {

    const checkDuplicatePatternName = this.MasterPatternList.find(item => item.PatternName == this.PatternName.value)
    // const Value = await this.mapPattern(this.PatternList, this.DigitList)
    if (checkDuplicatePatternName) {
      const data = {
        _id: checkDuplicatePatternName._id,
        Value: this.Pattern
      }
      // alert('update')
      let result = await this.updatePattern(data);
      if (result === 1) {
        this.Pattern = []
        this.PatternId.reset()
        this.PatternName.reset()
        this.MasterPatternList = await this.getPattern();
        this.alertSwal.alert('success', 'Success')

      }


    } else {
      // alert('insertPattern')
      const result = await this.insertPattern(this.Pattern)
      if (result) {
        // this.PatternList = []
        this.Pattern = []
        this.PatternId.reset()
        this.PatternName.reset()
        this.MasterPatternList = await this.getPattern();
        this.alertSwal.alert('success', 'Success')

      }
    }

    this.clearToggleAll();
  }

  insertPattern(value) {
    return new Promise((resolve) => {
      const data = {
        PatternName: this.PatternName.value,
        // Value: this.PatternList,
        Value: value
      }
      this.api.insertPattern(data).subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  updatePattern(item) {

    return new Promise((resolve) => {
      this.api.updatePattern(item._id, item).subscribe((data: any) => {
        resolve(data.modifiedCount)
      })
    })
  }


  mapPattern(name: any, digit: any) {
    return new Promise(resolve => {
      const temp1 = name.map((i, index) => {
        const temp2 = {
          Name: i,
          Digit: digit[index]
        }
        return temp2
      })
      resolve(temp1)
    })
  }

}
