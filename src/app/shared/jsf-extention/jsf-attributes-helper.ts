import { environment } from '../../../environments/environment';
import { CurrentLocationComponent } from './widgets/current-location/current-location.component';
import { DatetimePickerComponent } from './widgets/datetime-picker/datetime-picker.component';
import { DatePickerComponent } from './widgets/date-picker/date-picker.component';
import { DatetimeUtcComponent } from './widgets/datetime-utc/datetime-utc.component';
import { DynamicControlInjectorComponent } from './widgets/dynamic-control-injector-component/dynamic-control-injector.component';
import { EmailMatcherComponent } from './widgets/email-matcher/email-matcher.component';
import { ExtAutocompleteComponent } from './widgets/ext-autocomplete/ext-autocomplete.component';
import { ExtMdEditorComponent } from './widgets/ext-md-editor/ext-md-editor.component';
import { ExtMultiSelectComponent } from './widgets/ext-multi-select/ext-multi-select.component';
import { ExtQuerySelectComponent } from './widgets/ext-query-select/ext-query-select.component';
import { ExtSelectComponent } from './widgets/ext-select/ext-select.component';
import { ExtTextareaComponent } from './widgets/ext-textarea/ext-textarea.component';
import { ContentTextareaComponent } from './widgets/content-textarea/content-textarea.component';
import { LinkFieldComponent } from './widgets/link-field/link-field.component';
import { FileUploadComponent } from './widgets/file-upload/file-upload.component';
import { MultilingualInputComponent } from './widgets/multilingual-input/multilingual-input.component';
import { TextSectionComponent } from './widgets/text-section/text-section.component';
import { ValidationComponent } from './widgets/validation-component/validation-component.component';
import { MultilingualInputV2Component } from './widgets/multilingual-input-v2/multilingual-input-v2.component';

declare const $: any;
declare let Babili: any;

/**
 * Returns available JSON Scheme Form widgets.
 */
export const getJsfWidgets = (): any => {
    return {
        'ext-autocomplete': ExtAutocompleteComponent,
        'ext-md-editor': ExtMdEditorComponent,
        'rest-select': ExtSelectComponent, // Backward compatibility
        'current-location': CurrentLocationComponent,
        'ext-select': ExtSelectComponent,
        'ext-query-select': ExtQuerySelectComponent,
        'ext-multi-select': ExtMultiSelectComponent,
        'validation-component': ValidationComponent,
        'ext-textarea': ExtTextareaComponent,
        'content-textarea': ContentTextareaComponent,
        'multilingual-input': MultilingualInputComponent,
        'multilingual-input-v2': MultilingualInputV2Component,
        'datetime-utc': DatetimeUtcComponent,
        'datetime-picker': DatetimePickerComponent,
        'date-picker': DatePickerComponent,
        'link-field': LinkFieldComponent,
        'email-matcher': EmailMatcherComponent,
        'text-section': TextSectionComponent,
        'file-upload': FileUploadComponent,
        'dynamic-control': DynamicControlInjectorComponent,
    };
};

/**
 * JSON Scheme Form attributes builder.
 * @param spec - JSON schema
 * @param form - From details data could be in different structure
 */
export const buildJsfAttributes = (spec: any, form: any, widgets?: any): any => {
    const input = {dataSpec: interpolate(spec), dataForm: interpolate(form)};
    const jsfAttributes = spec && {
        schema: typeof (input.dataSpec) === 'string' ? JSON.parse(input.dataSpec) : input.dataSpec,
        layout: extractLayoutElement(input, 'layout'),
        form: conditionalForm(input.dataForm, 'form') || extractLayoutElement(input, 'form'),
        data: extractData(input) || extractElement(input, 'data'),
        entity: conditionalForm(input.dataForm, 'entity') || extractElement(input, 'entity'),
        options: conditionalForm(input.dataForm, 'options') || extractElement(input, 'options') || {},
        widgets: widgets || getJsfWidgets(),
        formLayout: formLayout(),
    } || null;
    jsfAttributes.options.data = jsfAttributes.data;
    jsfAttributes.form = addValidationComponent(jsfAttributes.form);
    jsfAttributes.layout = addValidationComponentToLayout(jsfAttributes.layout);
    // proxy data to options field for access original data inside component
    Object.defineProperty(jsfAttributes, 'data',
        {
            set(this: any, data: any): void { this.options.data = data; },
            get(this: any): any { return this.options.data; },
        });

    processValidationMessages(jsfAttributes);

    if (environment && !environment.production) {
        console.info('[dbg] %o', jsfAttributes);
    }

    return jsfAttributes;
};

export const nullSafe = (object: any): any => {
    return object ? object : {};
};

export const isJsonString = (str: any): any => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const toJsonString = (str: any): any => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
};

const interpolate = (spec: any): any => {
    if (typeof (spec) === 'string') {
        spec = spec.replace(/\\\\/g, '\\\\\\\\');
        try {
            return new Function('$', 'return `' + spec + '`;').call(this, $);
        } catch (e) {
            return transpilingForIE(spec, $);
        }
    }
    return spec;
};

export const addValidationComponent = (form: any): any => {
    if (form && form instanceof Array) {
        form.push({
            type: 'validation-component',
        });
    } else if (!form) {
        form = ['*', {
            type: 'validation-component',
        }];
    }
    return form;
};

export const addValidationComponentToLayout = (layout: any): any => {
    if (layout && layout instanceof Array) {
        layout.push({
            type: 'validation-component',
        });
    }
    return layout;
};

const traverce = (obj, task) => {
    for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] === 'object') {
                task(obj, property);
                traverce(obj[property], task);
            } else {
                task(obj, property);
            }

        }
    }
    return obj;
};

export const processValidationMessages = (jsfAttributes: any): any => {
    jsfAttributes.options = jsfAttributes.options || {};
    jsfAttributes.options.defautWidgetOptions = jsfAttributes.options.defautWidgetOptions || {};
    jsfAttributes.options.defautWidgetOptions.validationMessages = jsfAttributes.options.defautWidgetOptions
        .validationMessages || {};
    jsfAttributes.options.defautWidgetOptions.validationMessages.BE_ERROR = (errorMessage) => errorMessage;

    traverce(jsfAttributes.form, (object, property) => {
        if (property === 'validationMessages') {
            object.validationMessages = Object.assign({}, jsfAttributes.options.defautWidgetOptions.validationMessages,
                object.validationMessages);
        }
    });

    traverce(jsfAttributes.schema, (object, property) => {
        if (property === 'type' && (object.type instanceof Array)) {
            object.type = object.type.filter((it) => it !== 'null');
            if (object.type.length === 1) {
                object.type = object.type[0];
            }
        }
    });

    const validations = ['minLength', 'maxLength', 'pattern', 'format', 'minimum', 'maximum'];

    traverce(jsfAttributes.form, (object, property) => {

        if (property !== 'key') {
            return;
        }

        const hasValidations = validations.filter((k) => object.hasOwnProperty(k)).length > 0;
        if (!hasValidations) {
            return;
        }

        let key = object.key;
        key = key.replace(/\./g, '.properties.');
        key = key.replace(/\[\]/g, '.items');

        let field = jsfAttributes.schema || {};
        field = field.properties || {};

        const path = key.split('.');
        for (const i in path) {
            field = field[path[i]];
        }

        validations.filter((k) => object.hasOwnProperty(k)).forEach((it) => field[it] = object[it]);

        if (environment && !environment.production) {
            console.info('[dbg] %o', jsfAttributes.schema);
        }

    });

};

const conditionalForm = (inDataForm: any, fieldName) => {
    const dataForm = typeof (inDataForm) === 'string' ? JSON.parse(inDataForm) : inDataForm;
    if (!dataForm || !dataForm.conditionalForms) {
        return null;
    }

    const conditionalForms = dataForm.conditionalForms;
    let field = null;
    let condition = false;
    for (const conditionalFormConfig of conditionalForms) {
        const dynFn = new Function('$', conditionalFormConfig.condition);
        const value = dynFn($);
        if (value && !condition) {
            field = conditionalFormConfig[fieldName];
            condition = true;
            console.info('Use form config by condition', conditionalFormConfig.condition);
        } else if (value && condition) {
            console.warn('Error! Two conditions of conditionalForm are true!', conditionalFormConfig.condition);
        }
    }

    if (condition === false) {
        console.warn('No conditions of conditionalForm are true!');
    }
    return field;
};

const extractLayoutElement = (input: any, field: string) => {
    if (!input.dataForm) {
        return null;
    }
    const dataForm = typeof (input.dataForm) === 'string' ? JSON.parse(input.dataForm) : input.dataForm;
    if (dataForm instanceof Array) {
        return dataForm;
    }
    return dataForm[field];

};

const extractElement = (input: any, field: string) => {
    if (!input.dataForm) {
        return null;
    }
    const dataForm = typeof (input.dataForm) === 'string' ? JSON.parse(input.dataForm) : input.dataForm;
    return dataForm[field];
};

const extractData = (input: any) => {
    const dataForm = conditionalForm(input.dataForm, 'data')
    || typeof (input.dataForm) === 'string' ? JSON.parse(input.dataForm) : input.dataForm;
    if (!dataForm) {
        return null;
    }
    const data = dataForm.data || {};
    const dataFieldExpressions = dataForm.dataFieldExpressions || {};
    processDataFieldExpressions(dataFieldExpressions);
    return Object.assign(data, dataFieldExpressions);
};

const processDataFieldExpressions = (data: any) => {
    for (const i in data) {
        if (data[i] !== null && typeof (data[i]) === 'object') {
            processDataFieldExpressions(data[i]);
        } else {
            data[i] = new Function('expression', 'return ' + data[i])();
        }
    }
};

// TODO: find solution to remove this workaround form view
export const formLayout = (): void => {
    setTimeout(() => {
        // remove legend elements for the array view
        const legendList: HTMLElement[] = $('legend');
        for (const legend of legendList) {
            $(legend).addClass('hidden');
        }
        // auto height for the textarea element
        $('.textarea-auto-height textarea').trigger('keyup');
        $('mat-form-field').addClass('mat-form-field');
        $('mat-form-field').closest('div').addClass('form-group');
        $('.json-schema-form .mat-button, .json-schema-form .mat-button').addClass('btn');
        $('.json-schema-form .mat-button.mat-primary, .json-schema-form .mat-button.mat-primary')
            .addClass('btn-primary');
    }, 50);
};

export const transpilingForIE = (code: any, obj: any): any => {
    const tmpCode = parseTemplateLiterals(code, obj);
    if (isJsonString(tmpCode)) {
        return tmpCode;
    }
    let result;
    try {
        result = Babili.transform(tmpCode, {presets: ['es2015']}).code.replace(/"use strict";/, '');
    } catch (e) {
        result = tmpCode;
    }
    return result;

};

export const parseTemplateLiterals = (str: string, obj: any = {}): any => {
    let tmpStr = str.slice().replace(/\n/g, ' ');
    while (/\$\{.+\}/.test(tmpStr)) {
        // Find and get Template Literal "${...}" from string
        let literalVar = tmpStr.replace(/^(?:.*)(\$\{.+\})(?:.*)/, '$1');
        literalVar = literalVar.slice(0, literalVar.indexOf('}') + 1);
        const varArr = literalVar.slice(2, -1).split('.');
        varArr.shift();
        const value = varArr.reduce((res, el) => {
            try {
                res = res[el];
            } catch (e) {
                // empty block
            }
            return res;
        }, obj);
        tmpStr = tmpStr.replace(literalVar, value || '');
    }
    return tmpStr;
};
