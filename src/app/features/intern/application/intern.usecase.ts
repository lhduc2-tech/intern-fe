import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { InternRepository } from '../domain/intern.repository';
import { InternApiService } from '../data/intern-api.service';
import { InternResponse, InternRequest, InternSearchRequest, PageResponse } from '../domain/intern.model';

@Injectable({
  providedIn: 'root',
  useFactory: () => new InternUseCase(inject(InternApiService))
})
export class InternUseCase {
  constructor(private repository: InternRepository) {}

  searchInterns(request: InternSearchRequest): Observable<PageResponse<InternResponse>> {
    return this.repository.searchInterns(request);
  }

  searchInternshipSessions(request: any = { pageIndex: 0, pageSize: 100 }): Observable<PageResponse<any>> {
    return this.repository.searchInternshipSessions(request);
  }

  getIntern(id: string): Observable<InternResponse> {
    return this.repository.getIntern(id);
  }

  createIntern(request: InternRequest): Observable<InternResponse> {
    return this.repository.createIntern(request);
  }

  updateIntern(id: string, request: InternRequest): Observable<InternResponse> {
    return this.repository.updateIntern(id, request);
  }

  deleteIntern(id: string): Observable<void> {
    return this.repository.deleteIntern(id);
  }
}
