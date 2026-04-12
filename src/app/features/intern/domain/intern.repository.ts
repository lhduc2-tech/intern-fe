import { Observable } from 'rxjs';
import { InternResponse, InternRequest, InternSearchRequest, PageResponse } from './intern.model';

export abstract class InternRepository {
  abstract searchInterns(request: InternSearchRequest): Observable<PageResponse<InternResponse>>;
  abstract searchInternshipSessions(request: any): Observable<PageResponse<any>>;
  abstract getIntern(id: string): Observable<InternResponse>;
  abstract deleteIntern(id: string): Observable<void>;
  abstract createIntern(request: InternRequest): Observable<InternResponse>;
  abstract updateIntern(id: string, request: InternRequest): Observable<InternResponse>;
}
