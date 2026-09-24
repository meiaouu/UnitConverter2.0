import { Component } from '@angular/core'; import { Router } from '@angular/router'; import { AppStateService } from '../core/services/app-state.service';
@Component({standalone:true,template:''}) export class LaunchPage{constructor(state:AppStateService,router:Router){queueMicrotask(()=>router.navigateByUrl(state.onboardingDone()?'/home':'/welcome',{replaceUrl:true}))}}
