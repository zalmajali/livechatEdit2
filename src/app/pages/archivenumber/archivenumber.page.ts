import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import {ChatService} from "../../service/chat.service";
import {DatabaseService} from "../../service/database.service";
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
@Component({
  selector: 'app-archivenumber',
  templateUrl: './archivenumber.page.html',
  styleUrls: ['./archivenumber.page.scss'],
})
export class ArchivenumberPage implements OnInit {
 public arrow_back:any;
  public arrow_go:any;
  public floatD:any;
  public menue_up_one:any;
  public menue_up_tow:any;
  public menue_up_Three:any;
  public menue_down_on:any;
  public menue_down_tow:any;
  public menue_down_Three:any;
  public menue_down_four:any;
  public returnResultData:any;
  public returnChatArray:any = [];
  public returnChatSearchArray:any = [];
  public returnArrayChatFromServer:any;
  public returnResultDataByNumber:any;
  public returnArrayChatDataByNumberFromServer:any;
  public chatVal:any = 2;
  public noExisting:any;
  public searchData:any;
  public msg_count:any;
  public showSearch:boolean = false;
  public showSearchs:boolean = true;
  public search:any;
  public showCloseSearch:any=0;
  public timeCheck:any;
  public searchType:any=0;
  //check login
  public genaratedFullDate:any;
  public genaratedDate:any;
  public year:any;
  public month:any;
  public day:any;
  public hour:any;
  public minutes:any;
  public seconds:any;
  public mainUserName:any;
  public userName:any;
  public password:any;
  public apiKey:any;
  public sessionLogin:any;
  public department:any;
  public supervisor:any;
  public name:any;

//select date
  public firstYear:any=2022;
  public firstMonth:number =12;
  public firstday:any="01";

  public lastYear:any;
  public lastMonth:number=0;
  public lastday:any;

  public allFirstDate:any;
  public allLastDate:any;

  //page setting
  public checkLanguage: any=0;
  public language: any;
  public menuDirection: any;
  public menuDirectionTow: any;
  public showPassword: boolean = false;
  constructor(private databaseService: DatabaseService,private router: Router,private chatService: ChatService,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
    this.menu.enable(false,"sideMenu");
  }
  initialiseTranslation(){
    this.translate.get('menuDirection').subscribe((res: string) => {
      this.menuDirection = res;
    });
    this.translate.get('menuDirectionTow').subscribe((res: string) => {
      this.menuDirectionTow = res;
    });
    this.translate.get('floatD').subscribe((res: string) => {
      this.floatD = res;
    });
    this.translate.get('arrow_back').subscribe((res: string) => {
      this.arrow_back = res;
    });
    this.translate.get('arrow_go').subscribe((res: string) => {
      this.arrow_go = res;
    });
    this.translate.get('menue_up_one').subscribe((res: string) => {
      this.menue_up_one = res;
    });
    this.translate.get('menue_up_tow').subscribe((res: string) => {
      this.menue_up_tow = res;
    });
    this.translate.get('menue_up_Three').subscribe((res: string) => {
      this.menue_up_Three = res;
    });
    this.translate.get('menue_down_on').subscribe((res: string) => {
      this.menue_down_on = res;
    });
    this.translate.get('menue_down_tow').subscribe((res: string) => {
      this.menue_down_tow = res;
    });
    this.translate.get('menue_down_Three').subscribe((res: string) => {
      this.menue_down_Three = res;
    });
    this.translate.get('menue_down_four').subscribe((res: string) => {
      this.menue_down_four = res;
    });
    this.translate.get('noExistingChat').subscribe((res: string) => {
      this.noExisting = res;
    });
    this.translate.get('msg_count').subscribe((res: string) => {
      this.msg_count = res;
    });
    this.translate.get('search').subscribe((res: string) => {
      this.search = res;
    });
  }
  async ngOnInit() {
    await this.getDeviceLanguage();
    await this.checkLoginUser();
    await this.functionCreatTable();
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
    this.password = await this.storage.get('password');
    this.apiKey = await this.storage.get('apiKey');
    this.sessionLogin = await this.storage.get('sessionLogin');
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    this.day = currentDate.getDate();
    this.hour = currentDate.getHours();
    this.minutes  = currentDate.getMinutes();
    this.seconds = currentDate.getSeconds();
    if(this.month<10)
      this.month = '0'+ this.month;
    if(this.day<10) 
      this.day = '0'+ this.day;
    if(this.hour<10) 
      this.hour = '0'+ this.hour;
    if(this.minutes<10) 
      this.minutes = '0'+ this.minutes;
    if(this.seconds<10) 
      this.seconds = '0'+ this.seconds;
    this.genaratedDate = this.year+""+this.month+""+this.day;
    this.genaratedFullDate = this.year+""+this.month+""+this.day+this.hour+this.minutes+this.seconds;
    let formattedFirstMonth = String(this.firstMonth).padStart(2, '0');
    this.lastYear = this.firstYear;
    this.lastMonth = this.firstMonth+1;
    this.lastday = "31";
    if(this.lastMonth > 12){
      this.lastYear+=1;
      this.lastMonth = 1;
    }
    let formattedSecondMonth = String(this.lastMonth).padStart(2, '0');
    this.allFirstDate = this.firstYear+""+this.firstday+""+formattedFirstMonth;
    this.allLastDate = this.lastYear+""+this.lastday+""+formattedSecondMonth;
    await this.functionReturnData();
  }
  functionRemoveSearch(){
    this.searchData = "";
    this.showCloseSearch = 0;
    this.searchType = 0;
  }
  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.showSearchs = !this.showSearchs;
    this.searchType = 0;
    this.searchData = "";
    this.showCloseSearch = 0;
  }
  async functionReturnData(){
    let key = this.mainUserName+this.userName+this.password+"(OLH)"+this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize();
    this.apiKey=this.apiKey.toString();
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    this.day = currentDate.getDate();
    this.hour = currentDate.getHours();
    this.minutes  = currentDate.getMinutes();
    this.seconds = currentDate.getSeconds();
    if(this.month<10)
      this.month = '0'+ this.month;
    if(this.day<10) 
      this.day = '0'+ this.day;
    if(this.hour<10) 
      this.hour = '0'+ this.hour;
    if(this.minutes<10) 
      this.minutes = '0'+ this.minutes;
    if(this.seconds<10) 
      this.seconds = '0'+ this.seconds;
    this.genaratedFullDate = this.year+""+this.month+""+this.day+this.hour+this.minutes+this.seconds;
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'onliceData':2,'date':`${this.allFirstDate}-${this.allLastDate}`};
    console.log(sendValues);
    this.chatService.chatGetHistoryUser(sendValues).then(async data=>{
      this.returnResultData = data;
      let errorData = this.returnResultData.message;
      if(errorData == 'ok'){
        let counter = 0;
        if(this.returnChatArray.length == 0){
          this.returnChatArray=[];
          counter = 0;
        }
        else
          counter = this.returnChatArray.length;
          let countOfData = 0;
          this.returnArrayChatFromServer = this.returnResultData.data;
          Object.keys(this.returnArrayChatFromServer).forEach(key => {
            this.returnChatArray[counter]=[];
            this.returnChatArray[counter]['mobile'] = this.returnArrayChatFromServer[key];
            counter++;
          });
          countOfData = this.returnChatArray.length;
          console.log(countOfData)
          if(countOfData == 0)
            this.chatVal = 0;
          else{
            this.chatVal = 1;
          }  
      }else {
        this.chatVal = 0;
      }
    }).catch(error=>{
      this.functionReturnData();
    });
  }
  async loadeMore(){
    this.firstMonth = this.lastMonth+1;
    if(this.firstMonth > 12){
      this.firstMonth = 1;
    }
    this.firstYear = this.lastYear;
    this.firstday = "01";

    let formattedFirstMonth = String(this.firstMonth).padStart(2, '0');
    this.lastYear = this.firstYear;
    this.lastMonth = this.firstMonth+1;
    this.lastday = "31";
    if(this.lastMonth > 12){
      this.lastYear+=1;
      this.lastMonth = 1;
    }
    let formattedSecondMonth = String(this.lastMonth).padStart(2, '0');
    this.allFirstDate = this.firstYear+""+this.firstday+""+formattedFirstMonth;
    this.allLastDate = this.lastYear+""+this.lastday+""+formattedSecondMonth;
    await this.functionReturnData();
  }
  functionSearch(event:any){
    this.searchData = event.target.value;
    if(this.searchData == "" || this.searchData == undefined){
      this.showCloseSearch = 0;
      this.searchType = 0;      
    }else{
      this.searchType = 1; 
      this.showCloseSearch = 1;
        let data = this.returnChatArray.filter((item:any) => item.mobile.includes(this.searchData));
        if(typeof data!== 'undefined'){
          this.returnChatSearchArray = [];
          for(let i = 0; i < data.length;i++) {
          this.returnChatSearchArray[i]=[];
          this.returnChatSearchArray[i]['mobile'] = data[i].mobile;
        }
        }else{
          this.searchType = 0;   
        }
    }
  }
  async functionCreatTable(){
    await this.databaseService.createTables('numbers', '`id` INTEGER PRIMARY KEY AUTOINCREMENT, `number` VARCHAR(255) UNIQUE')
      .then((data:any) => {
       }) 
    .catch(error =>alert("Error In Data Base"));

    await this.databaseService.createTables('msg_temp', '`id` INTEGER PRIMARY KEY AUTOINCREMENT,`msgId` INTEGER UNIQUE, `numberSend` VARCHAR(255),`msg` TEXT,`time` VARCHAR(255),`date` VARCHAR(255),`dateId` VARCHAR(255),`from` INTEGER,`filePath` VARCHAR(255),`msg_status` VARCHAR(255),`session_id` VARCHAR(255),`private_note` INTEGER')
    .then((data:any) => {
     }) 
     .catch(error =>alert("Error In Data Base"));
    await this.databaseService.createTables('msg', '`id` INTEGER PRIMARY KEY AUTOINCREMENT,`msgId` INTEGER UNIQUE, `numberSend` VARCHAR(255),`msg` TEXT,`time` VARCHAR(255),`date` VARCHAR(255),`dateId` VARCHAR(255),`from` INTEGER,`filePath` VARCHAR(255),`msg_status` VARCHAR(255),`session_id` VARCHAR(255),`private_note` INTEGER')
      .then((data:any) => {
       }) 
       .catch(error =>alert("Error In Data Base"));
  }
  //pages
  functionSetting(){
    this.navCtrl.navigateRoot('settings');
  }
  functionContact(){
    this.navCtrl.navigateRoot('contacts');
  }
  functionChatbot(){
    this.navCtrl.navigateForward('chatbot');
  }
  functionArchive(number:any){
    this.navCtrl.navigateRoot(['/archive', {number:number,chatSessionId:"",type:2}]);
  }
  functionQueued(){
    this.navCtrl.navigateRoot('queued');
  }
  functionUnassigned(){
    this.navCtrl.navigateRoot('unassigned');
  }
  functionChats(number:any,chatSessionId:any){
    this.navCtrl.navigateRoot(['/chats', {number:number,chatSessionId:chatSessionId}]);
  }
  functionHome(){
    this.navCtrl.navigateForward('home');
  }
  async checkLoginUser(){
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
    this.password = await this.storage.get('password');
    this.apiKey = await this.storage.get('apiKey');
    this.sessionLogin = await this.storage.get('sessionLogin');
    this.department = await this.storage.get('department');
    this.supervisor = await this.storage.get('supervisor');
    this.name = await this.storage.get('name');
    if(this.mainUserName == null || this.userName == null || this.password == null || this.apiKey == null || this.sessionLogin == null || this.department == null || this.supervisor == null || this.name == null){
      this.storage.remove('mainUserName');
      this.storage.remove('userName');
      this.storage.remove('password');
      this.storage.remove('apiKey');
      this.storage.remove('sessionLogin');
      this.storage.remove('department');
      this.storage.remove('supervisor');
      this.storage.remove('name');
      this.navCtrl.navigateRoot('login');
    }
  }
  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async checkLanguage=>{
      this.checkLanguage = checkLanguage
    });
    if(this.checkLanguage){
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      this.initialiseTranslation();
    }else{
      if (window.Intl && typeof window.Intl === 'object') {
        let Val  = navigator.language.split("-");
        this.translate.setDefaultLang(Val[0]);
        if (Val[0] == "ar" ||  Val[0] == "en")
          this.language = Val[0];
        else
          this.language = 'en';
        this.translate.use(this.language);
        this.initialiseTranslation();
      }
      else{
        this.globalization.getPreferredLanguage().then(res => {
          let Val  = res.value.split("-");
          this.translate.setDefaultLang(Val[0]);
          if (Val[0] == "ar" || Val[0] == "en")
            this.language = Val[0];
          else
            this.language = 'en';
          this.translate.use(this.language);
          this.initialiseTranslation();
        }).catch(e => {console.log(e);});
      }
    }
  }
  async displayResult(message:any){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 4500,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
}
