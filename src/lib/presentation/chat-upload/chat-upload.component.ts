import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild, TemplateRef, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'std-chat-upload',
  template: `
    <div class="std-chat-controls-input-group">
      <input [(ngModel)]="data" (keyup.enter)="onChange(data); enter.next()" (ngModelChange)="onChange(data)" [placeholder]="'Escribe el texto aquí ...'" [hidden]="tmpFile">
      <div class="std-chat-controls-img-preview" *ngIf="tmpFile">
        <img *ngIf="tmpFile.type.includes('image'); else fileIcon"  [src]="imgURL"/>
        <ng-template #fileIcon>
          <svg width="35" height="35" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" >
            <path d="M494.479,138.557L364.04,3.018C362.183,1.09,359.621,0,356.945,0h-194.41c-21.757,0-39.458,17.694-39.458,39.442v137.789
              H44.29c-16.278,0-29.521,13.239-29.521,29.513v147.744C14.769,370.761,28.012,384,44.29,384h78.787v88.627
              c0,21.71,17.701,39.373,39.458,39.373h295.238c21.757,0,39.458-17.653,39.458-39.351V145.385
              C497.231,142.839,496.244,140.392,494.479,138.557z M359.385,26.581l107.079,111.265H359.385V26.581z M44.29,364.308
              c-5.42,0-9.828-4.405-9.828-9.82V206.744c0-5.415,4.409-9.821,9.828-9.821h265.882c5.42,0,9.828,4.406,9.828,9.821v147.744
              c0,5.415-4.409,9.82-9.828,9.82H44.29z M477.538,472.649c0,10.84-8.867,19.659-19.766,19.659H162.535
              c-10.899,0-19.766-8.828-19.766-19.68V384h167.403c16.278,0,29.521-13.239,29.521-29.512V206.744
              c0-16.274-13.243-29.513-29.521-29.513H142.769V39.442c0-10.891,8.867-19.75,19.766-19.75h177.157v128
              c0,5.438,4.409,9.846,9.846,9.846h128V472.649z"/>

            <path d="M132.481,249.894c-3.269-4.25-7.327-7.01-12.173-8.279c-3.154-0.846-9.923-1.269-20.308-1.269H72.596v84.577h17.077
              v-31.904h11.135c7.731,0,13.635-0.404,17.712-1.212c3-0.654,5.952-1.99,8.856-4.01c2.904-2.019,5.298-4.798,7.183-8.336
              c1.885-3.538,2.827-7.904,2.827-13.096C137.385,259.634,135.75,254.144,132.481,249.894z M117.856,273.173
              c-1.288,1.885-3.067,3.269-5.337,4.154s-6.769,1.327-13.5,1.327h-9.346v-24h8.25c6.154,0,10.25,0.192,12.288,0.577
              c2.769,0.5,5.058,1.75,6.865,3.75c1.808,2,2.712,4.539,2.712,7.615C119.789,269.096,119.144,271.288,117.856,273.173z"/>

            <path d="M219.481,263.452c-1.846-5.404-4.539-9.971-8.077-13.702s-7.789-6.327-12.75-7.789c-3.692-1.077-9.058-1.615-16.096-1.615
              h-31.212v84.577h32.135c6.308,0,11.346-0.596,15.115-1.789c5.039-1.615,9.039-3.865,12-6.75c3.923-3.808,6.942-8.788,9.058-14.942
              c1.731-5.039,2.596-11.039,2.596-18C222.25,275.519,221.327,268.856,219.481,263.452z M202.865,298.183
              c-1.154,3.789-2.644,6.51-4.471,8.163c-1.827,1.654-4.125,2.827-6.894,3.519c-2.115,0.539-5.558,0.808-10.327,0.808h-12.75v0
              v-56.019h7.673c6.961,0,11.635,0.269,14.019,0.808c3.192,0.692,5.827,2.019,7.904,3.981c2.077,1.962,3.692,4.692,4.846,8.192
              c1.154,3.5,1.731,8.519,1.731,15.058C204.596,289.231,204.019,294.394,202.865,298.183z"/>

            <polygon points="294.827,254.654 294.827,240.346 236.846,240.346 236.846,324.923 253.923,324.923 253.923,288.981
              289.231,288.981 289.231,274.673 253.923,274.673 253.923,254.654 		"/>
          </svg>
        </ng-template>
        <span>{{ tmpFile.name }}</span>
      </div>
      <button class="std-chat-controls-upload" type="button" (click)="openFileDialog()">
        <svg *ngIf="!tmpFile; else removePreview" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.4403 11.0499L12.2503 20.2399C11.1244 21.3658 9.59747 21.9983 8.00529 21.9983C6.41311 21.9983 4.88613 21.3658 3.76029 20.2399C2.63445 19.1141 2.00195 17.5871 2.00195 15.9949C2.00195 14.4027 2.63445 12.8758 3.76029 11.7499L12.9503 2.55992C13.7009 1.80936 14.7188 1.3877 15.7803 1.3877C16.8417 1.3877 17.8597 1.80936 18.6103 2.55992C19.3609 3.31048 19.7825 4.32846 19.7825 5.38992C19.7825 6.45138 19.3609 7.46936 18.6103 8.21992L9.41029 17.4099C9.03501 17.7852 8.52602 17.996 7.99529 17.996C7.46456 17.996 6.95557 17.7852 6.58029 17.4099C6.20501 17.0346 5.99418 16.5256 5.99418 15.9949C5.99418 15.4642 6.20501 14.9552 6.58029 14.5799L15.0703 6.09992" stroke="#A8A8A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ng-template #removePreview>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8L8 14M14 14L8 8L14 14Z" stroke="#DD4141" stroke-width="2" stroke-linecap="round"/>
            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#DD4141" stroke-width="2"/>
          </svg>
        </ng-template>
        <input #fileInput type="file" (change)="onFileInput($event)" style="display:none;" accept="image/jpeg,image/gif,image/png,application/pdf" (keyup.enter)="enter.next()" />
      </button>
    </div>
  `,
  styleUrls: ['./chat-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChatUploadComponent),
      multi: true
    }
  ]
})

export class ChatUploadComponent implements OnInit, ControlValueAccessor {
  @Output() enter: EventEmitter<void> = new EventEmitter();
  @ViewChild('fileInput') fileInput!: ElementRef;
  data!: string | File;
  tmpFile!: File | null;
  isDisabled!: boolean;
  imgURL!: string;

  constructor() { }

  onChange = (_: any): any => { };
  onTouch = (_: any): any => { };

  ngOnInit() { }

  openFileDialog(): void {
    if (!this.tmpFile) {
      this.fileInput.nativeElement.click()
    } else {
      this.tmpFile = null;
      this.imgURL = '';
    }
  }

  onFileInput(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = element.files?.item(0) ? element.files?.item(0) : null;

    if (file) {
      this.tmpFile = file as File;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgURL = reader.result as string;
      }

      this.onChange(file);
      this.data = '';
    }
  }

  writeValue(data: string | File): void {
    if (data) {
      const prototype = Object.getPrototypeOf(data);
      if (prototype === File.prototype) {
        this.tmpFile = data as File;
      } else if (prototype === String.prototype) {
        this.data = data;
      }
    } else {
      this.tmpFile = null;
      this.data = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(): void {
    this.isDisabled = true;
  }
}
