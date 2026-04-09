import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { InternRepository } from '../domain/intern.repository';
import { InternResponse, InternSearchRequest, PageResponse } from '../domain/intern.model';

@Injectable({
  providedIn: 'root'
})
export class InternApiService implements InternRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.privateApi}/interns`; // Note: Base path according to @RequestMapping("${application.path.base.private}/interns")

  searchInterns(request: InternSearchRequest): Observable<PageResponse<InternResponse>> {
    return this.http.post<PageResponse<InternResponse>>(`${this.baseUrl}/search`, request);
  }

  getIntern(id: string): Observable<InternResponse> {
    return this.http.get<InternResponse>(`${this.baseUrl}/${id}`);
  }

  deleteIntern(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
