import { DataQa } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';

export interface XmEmailControlOptions extends DataQa {
    title: Translate,
    id?: string,
    required?: boolean,
}
