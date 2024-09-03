import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from './toast-service';

import { circle, latLng, tileLayer } from 'leaflet';
import { SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';
import { SwiperOptions } from 'swiper';

import {BestSelling, TopSelling, RecentSelling, statData } from './data';
import { ChartType } from './dashboard.model';
import { accessService } from 'src/app/services/permissions';
import { AutoLogOutService } from 'src/app/services/auto-logout';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Crypt } from 'src/app/services/crypto-serve';
import { PentestService } from 'src/app/services/pentest';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Ecommerce Component
 */
export class DashboardComponent implements OnInit {

  // bread crumb items
  basicChart: any;
  basicAreaChart: any;
  simplePieChart: any;
  breadCrumbItems: any = [];
  analyticsChart!: ChartType;
  BestSelling: any;
  TopSelling: any;
  RecentSelling: any;
  SalesCategoryChart!: ChartType;
  statData!: any;
  distributedColumnChart: any;

  userInfo: any=[];

  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;
  @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;

  selectedLanguage:any;

  loader: any = {
    users: false,
    merchants: false,
    customers: false
  }

  constructor(
    public toastService: ToastService,
    public access: accessService,
    public autologout : AutoLogOutService,
    private translate: TranslateService,
    private pentestService: PentestService,
    private crypto: Crypt,
    ) {
    }

  userList: any = [];
  merchantList: any = [];
  customerList: any = [];

  tsFileTrans: any = [];

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadBreadCrumbs();
    });
    setTimeout(() => { this.loadBreadCrumbs(); }, 1000);
    this.access.getPermission()

     /**
     * Fetches the data
     */
      this.fetchData();

    // Chart Color Data Get Function
    this._analyticsChart('["--vz-primary", "--vz-success", "--vz-danger"]');
    this._SalesCategoryChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
  
    this._simplePieChart('["#5595C8", "#2F78B0", "#686B76", "#033F6E"]');

    this._distributedColumnChart('["--vz-primary"]')

    this.userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');

    this.load_users();
    this.load_merchants();
    this.load_customers();

    // this.autologout.AutoLogout();
  }

  loadBreadCrumbs(){
    this.breadCrumbItems = [];
    this.translate.get('DASHBOARD.text1').subscribe((text:string) => { 
      this.breadCrumbItems.push({ label: text, active: true }) 
    });
  }

  load_users(){
    this.loader.users = true;
    let postParams = {
      "Service":"user",
      "Method":"GetUserList",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.userList = res['data'];
        this.loader.users = false;
      },
      (err: any) => {
        console.log(err)
        this.loader.users = false;
      }
    )
  }

  load_merchants(){
    this.loader.merchants = true;
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetAllMerchants",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.merchantList = res['Data'] ? res['Data'].reverse() : [];
        this.loader.merchants = false;
      },
      (err: any) => {
        console.log(err)
        this.loader.merchants = false;
      }
    )
  }

  load_customers(){
    this.loader.customers = true;
    let postParams = {
      "Service":"xp-ash-uad",
      "Method":"GetAllCustomers",
    };
    let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
    this.pentestService.request(encrypted_data).subscribe(
      async (data: any) => {
        let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
        this.customerList = res['Data'];
        this.loader.customers = false;
      },
      (err: any) => {
        console.log(err)
        this.loader.customers = false;
      }
    )
  }

  private _distributedColumnChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.distributedColumnChart = {
      series: [{
        data: [21, 22, 10, 28, 16, 21, 30]
      }],
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart:any, w:any, e:any) {
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        labels: {
          style: {
            colors: colors,
            fontSize: '12px'
          }
        }
      }
    };
  }


  private _simplePieChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.simplePieChart = {
      series: [25, 25, 50],
      chart: {
        height: 500,
        type: "pie",
      },

      dataLabels: {
        dropShadow: {
          enabled: false,
        },
        position: "center",
      },
      colors: colors,
    };
  }

  // Chart Colors Set
  private getChartColorsArray(colors:any) {
    colors = JSON.parse(colors);
    return colors.map(function (value:any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
            if (color) {
            color = color.replace(" ", "");
            return color;
            }
            else return newValue;;
        } else {
            var val = value.split(',');
            if (val.length == 2) {
                var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                return rgbaColor;
            } else {
                return newValue;
            }
        }
    });
  }

  /**
 * Sales Analytics Chart
 */
  private _analyticsChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.analyticsChart = {
      chart: {
          height: 370,
          type: "line",
          toolbar: {
              show: false,
          },
      },
      stroke: {
          curve: "straight",
          dashArray: [0, 0, 8],
          width: [2, 0, 2.2],
      },
      colors: colors,
      series: [{
          name: 'Orders',
          type: 'area',
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
      }, {
          name: 'Earnings',
          type: 'bar',
          data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
              88.51, 36.57]
      }, {
          name: 'Refunds',
          type: 'line',
          data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35]
      }],
      fill: {
          opacity: [0.1, 0.9, 1],
      },
      labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
      markers: {
          size: [0, 0, 0],
          strokeWidth: 2,
          hover: {
              size: 4,
          },
      },
      xaxis: {
          categories: [
              "Monday",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
          ],
          axisTicks: {
              show: false,
          },
          axisBorder: {
              show: false,
          },
      },
      grid: {
          show: true,
          xaxis: {
              lines: {
                  show: true,
              },
          },
          yaxis: {
              lines: {
                  show: false,
              },
          },
          padding: {
              top: 0,
              right: -2,
              bottom: 15,
              left: 10,
          },
      },
      legend: {
          show: true,
          horizontalAlign: "center",
          offsetX: 0,
          offsetY: -5,
          markers: {
              width: 9,
              height: 9,
              radius: 6,
          },
          itemMargin: {
              horizontal: 10,
              vertical: 0,
          },
      },
      plotOptions: {
          bar: {
              columnWidth: "30%",
              barHeight: "70%",
          },
      },
    };
  }

  /**
 *  Sales Category
 */
   private _SalesCategoryChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.SalesCategoryChart = {
      series: [44, 55, 41, 17, 15],
      labels: ["Direct", "Social", "Email", "Other", "Referrals"],
      chart: {
          height: 333,
          type: "donut",
      },
      legend: {
          position: "bottom",
      },
      stroke: {
          show: false
      },
      dataLabels: {
          dropShadow: {
              enabled: false,
          },
      },
      colors: colors
    };
  }

   /**
   * Fetches the data
   */
    private fetchData() {
      this.BestSelling = BestSelling;
      this.TopSelling = TopSelling;
      this.RecentSelling = RecentSelling;
      this.statData = statData;
    }

    /**
   * Sale Location Map
   */
  options = {
    layers: [
      tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
        id: "mapbox/light-v9",
        tileSize: 512,
        zoomOffset: -1,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      })
    ],
    zoom: 1.1,
    center: latLng(28, 1.5)
  };
  layers = [
    circle([41.9, 12.45], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([12.05, -61.75], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([1.3, 103.8], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
  ];

  /**
 * Swiper Vertical  
   */
   public Vertical: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'vertical',
    slidesPerView: 2,
    pagination: true,
  };

  /**
   * Recent Activity
   */
   toggleActivity() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if(recentActivity != null){
      recentActivity.classList.toggle('d-none');
    }

    if (window.screen.width <= 767) {
      const recentActivity = document.querySelector('.layout-rightside-col');
      if(recentActivity != null){
        recentActivity.classList.add('d-block');
        recentActivity.classList.remove('d-none');
      }
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
   SidebarHide() {
    const recentActivity = document.querySelector('.layout-rightside-col');
      if(recentActivity != null){
        recentActivity.classList.remove('d-block');
      }
  }

  

}
