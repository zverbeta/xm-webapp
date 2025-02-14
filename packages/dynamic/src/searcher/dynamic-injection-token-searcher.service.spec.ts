import { Component, Injector, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { XmDynamicEntries } from '@xm-ngx/dynamic';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';

import { DynamicInjectionTokenSearcherService } from './dynamic-injection-token-searcher.service';

function defineInjector(components: XmDynamicEntries): Injector {
    return Injector.create({providers: [{provide: XM_DYNAMIC_ENTRIES, useValue: components}]});
}

@Component({template: ''})
class MyComp {
}

@NgModule({})
class MyModule {
}


describe('DynamicInjectionTokenSearcherService', () => {
    let service: DynamicInjectionTokenSearcherService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject<DynamicInjectionTokenSearcherService>(DynamicInjectionTokenSearcherService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return component', async () => {
        const component = {selector: 'component', loadChildren: () => MyComp};
        const injector = defineInjector([component]);
        expect(service).toBeTruthy();

        const result = await service.search(component.selector, {injector});
        expect(result).toBe(component.loadChildren());
    });

    it('should return lazy module', async () => {
        const component = {selector: 'component', loadChildren: () => Promise.resolve(MyModule)};
        const injector = defineInjector([component]);
        expect(service).toBeTruthy();

        const result = await service.search(component.selector, {injector});
        expect(result).toBe(await component.loadChildren());
    });

    it('should return null', async () => {
        const component = {selector: 'component', loadChildren: () => MyComp};
        const injector = defineInjector([component]);
        expect(service).toBeTruthy();

        const result = await service.search('selector 1', {injector});
        expect(result).toBeNull();
    });
});
