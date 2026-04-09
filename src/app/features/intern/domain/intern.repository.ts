import { Observable } from 'rxjs';
import { InternResponse, InternSearchRequest, PageResponse } from './intern.model';

export abstract class InternRepository {
  abstract searchInterns(request: InternSearchRequest): Observable<PageResponse<InternResponse>>;
  abstract getIntern(id: string): Observable<InternResponse>;
  abstract deleteIntern(id: string): Observable<void>;
}
