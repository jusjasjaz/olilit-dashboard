import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Ck Editer
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Sweet Alert
import Swal from 'sweetalert2';

// Email Data Get
import { emailData } from './data';
import { Email } from './mailbox.model';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss']
})

/**
 * Mailbox Component
 */
export class MailboxComponent implements OnInit {

  public Editor = ClassicEditor;
  emailData!: Email[];
  emailIds: number[] = [];
  isShowMenu:boolean = true;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    /**
     * Fetches the data
     */
     this.fetchData();

    // Compose Model Hide/Show
     var isShowMenu = false;
        document.querySelectorAll(".email-menu-btn").forEach(function (item) {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                    isShowMenu = true;
                document.getElementById('menusidebar')?.classList.add("menubar-show");
            });
        });
        document.querySelector('.email-wrapper')?.addEventListener('click', function () {
            if (document.querySelector(".email-menu-sidebar")?.classList.contains('menubar-show')) {
                if (!isShowMenu) {
                    document.querySelector(".email-menu-sidebar")?.classList.remove("menubar-show");
                }
                isShowMenu = false;
            }
        });
  }

  /**
   * Fetches the data
   */
   private fetchData() {
     document.getElementById('emaildata')?.classList.add('d-none')
     setTimeout(() => {
      document.getElementById('emaildata')?.classList.remove('d-none')
      this.emailData = emailData;
      document.getElementById('mailLoader')?.classList.add('d-none')
    },1000);
  }

   /**
   * Open modal
   * @param content content
   */
    open(content: any) {
      this.modalService.open(content, { size: 'lg', centered: true });
    }

     /**
   * on settings button clicked from topbar
   */
   onSettingsButtonClicked() {
    document.body.classList.toggle('email-detail-show');
  }

    /**
   * Hide the sidebar
   */
     public hide() {
      document.body.classList.remove('email-detail-show');
    }

    /**
   * Confirmation mail model
   */
     confirm() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.value) {
          this.deleteMail();
          Swal.fire('Deleted!', 'Mail has been deleted.', 'success');
        }
      });
    }

    /***
     * Delete Mail
     */
     deleteMail() {
      const found = this.emailData.some(r => this.emailIds.indexOf(r.id) >= 0);
      if (found) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.emailIds.length; i++) {
          const obj: any = this.emailData.find(o => o.id === this.emailIds[i]);
          this.emailData.splice(this.emailData.indexOf(obj), 1);
        }
      }
      this.emailIds = [];
    }

  /***
   * send mail select multiple mail
   */
   selectMail(event: any, id: any) {
    if (event.target.checked) {
      this.emailIds.push(id);
    } else {
      this.emailIds.splice(this.emailIds.indexOf(id), 1);
    }
  }

  /**
   * Show Mail modal
   * @param content modal content
   */
  
   showMail() {     
    const showMail = document.querySelector('.email-wrapper .email-menu-sidebar');
      if(showMail != null){
        showMail.classList.add('menubar-show');
      }
  }
  

  /**
   * SidebarHide modal
   * @param content modal content
   */
   SidebarHide() {
    const recentActivity = document.querySelector('.email-wrapper .email-menu-sidebar');
      if(recentActivity != null){
        recentActivity.classList.remove('menubar-show');
      }
  }


}
