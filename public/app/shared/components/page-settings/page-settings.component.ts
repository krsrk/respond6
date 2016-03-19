import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {CanActivate} from 'angular2/router'
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt'
import {PageService} from '/app/shared/services/page.service'
import {RouteService} from '/app/shared/services/route.service'

@Component({
    selector: 'respond-page-settings',
    templateUrl: './app/shared/components/page-settings/page-settings.component.html',
    providers: [PageService, RouteService]
})

@CanActivate(() => tokenNotExpired())

export class PageSettingsComponent {

  routes;
  errorMessage;

  // model to store
  model: {
    Url: '',
    Title: '',
    Description: '',
    Keywords: '',
    Callout: '',
    Layout: 'content',
    Language: 'en'
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }
  
  @Input()
  set page(page){

    // set visible
    this.model = page;

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();

  constructor (private _pageService: PageService, private _routeService: RouteService) {}

  /**
   * Init pages
   */
  ngOnInit() {

    this._routeService.list()
                     .subscribe(
                       data => { this.routes = data; },
                       error =>  this.errorMessage = <any>error
                      );

  }

  /**
   * Hides the modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the form
   */
  submit() {
  

    this._pageService.updateSettings(this.model.Url, this.model.Title, this.model.Description, this.model.Keywords, this.model.Callout, this.model.Layout, this.model.Language)
                     .subscribe(
                       data => { this.success(); },
                       error =>  this.errorMessage = <any>error
                      );

  }

  /**
   * Handles a successful submission
   */
  success() {
  
    this._visible = false;
    this.onUpdate.emit(null);

  }


}