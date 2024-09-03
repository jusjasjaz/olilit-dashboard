import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GroupUser, ChatUser, ChatMessage } from './chat.model';
import { groupData, chatData, chatMessagesData } from './data';

// Light Box
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

/**
 * Chat Component
 */
export class ChatComponent implements OnInit {

  chatData!: ChatUser[];
  groupData!: GroupUser[];
  chatMessagesData!: ChatMessage[];
  formData!: FormGroup;
  usermessage!: string;
  isFlag: boolean = false;
  submitted = false;
  isStatus: string = 'online';
  isProfile: string = 'assets/images/users/avatar-2.jpg';
  username: any = 'Lisa Parker';
  @ViewChild('scrollRef') scrollRef:any;

  images: { src: string; thumb: string; caption: string }[] = [];

  constructor(public formBuilder: FormBuilder, private lightbox: Lightbox) { 
    for (let i = 1; i <= 24; i++) {
      const src = '../../../../assets/images/small/img-' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';
      const thumb = '../../../../assets/images/small/img-' + i + '-thumb.jpg';
      const item = {
        src: src,
        caption: caption,
        thumb: thumb
      };
      this.images.push(item);
    }
  }

  ngOnInit(): void {
    // Chat Data Get Function
    this._fetchData();

    // Validation
    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    // Chat Data Get Function
    this._fetchData();
  }

  ngAfterViewInit() {
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 100;
  }

  // Chat Data Fetch
  private _fetchData() {
    this.groupData = groupData;
    this.chatData = chatData;
    this.chatMessagesData = chatMessagesData;
  }

  onListScroll() { }

  /**
   * Returns form
   */
   get form() {
    return this.formData.controls;
  }

  /**
   * Save the message in chat
   */
   messageSave() {
    const message = this.formData.get('message')!.value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatMessagesData.push({
        align: 'right',
        name: 'Marcus',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes(),
      });
      this.onListScroll();

      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null,
      });
    }
    this.submitted = true;
  }

  /***
  * OnClick User Chat show
  */
  chatUsername(name: string, profile: any, status: string) {
    this.isFlag = true;
    this.username = name;
    this.usermessage = 'Hello';
    this.chatMessagesData = [];
    const currentDate = new Date();
    this.isStatus = status;
    this.isProfile = profile ? profile:'assets/images/users/user-dummy-img.jpg';
    this.chatMessagesData.push({
      name: this.username,
      message: this.usermessage,
      profile: this.isProfile ? this.isProfile:'assets/images/users/user-dummy-img.jpg',
      time: currentDate.getHours() + ':' + currentDate.getMinutes(),
    });
    const userChatShow = document.querySelector('.user-chat');
    if(userChatShow != null){
      userChatShow.classList.add('user-chat-show');
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
   SidebarHide() {
    const recentActivity = document.querySelector('.user-chat');
      if(recentActivity != null){
        recentActivity.classList.remove('user-chat-show');
      }
  }

  /**
   * Info Model toggle
   */
     onChatInfoClicked() {
      const rightBar = document.getElementById('userProfileCanvasExample');
      if(rightBar != null){
        rightBar.classList.toggle('show');
        rightBar.setAttribute('style',"visibility: visible;");
      }
    }

       /**
   * Hide the sidebar
   */
  public hide() {
    const rightBar = document.getElementById('userProfileCanvasExample');
    if(rightBar != null){
      rightBar.classList.remove('show');
      rightBar.removeAttribute('style');
    }
  }

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.images, index, { });
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

}
