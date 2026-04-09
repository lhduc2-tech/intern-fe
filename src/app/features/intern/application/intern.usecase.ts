import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { InternRepository } from '../domain/intern.repository';
import { InternApiService } from '../data/intern-api.service';
import { InternResponse, InternSearchRequest, PageResponse } from '../domain/intern.model';

@Injectable({
  providedIn: 'root',
  useFactory: () => new InternUseCase(inject(InternApiService))
})
export class InternUseCase {
  constructor(private repository: InternRepository) {}

  searchInterns(request: InternSearchRequest): Observable<PageResponse<InternResponse>> {
    return this.repository.searchInterns(request);
  }

  getIntern(id: string): Observable<InternResponse> {
    return this.repository.getIntern(id);
  }

  deleteIntern(id: string): Observable<void> {
    return this.repository.deleteIntern(id);
  }
}
