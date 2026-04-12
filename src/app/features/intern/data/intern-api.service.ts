import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { InternRepository } from '../domain/intern.repository';
import { InternResponse, InternRequest, InternSearchRequest, PageResponse } from '../domain/intern.model';

@Injectable({
  providedIn: 'root'
})
export class InternApiService implements InternRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.privateApi}/interns`; // Note: Base path according to @RequestMapping("${application.path.base.private}/interns")
  private readonly sessionUrl = `${environment.privateApi}/internship-sessions`;

  searchInterns(request: InternSearchRequest): Observable<PageResponse<InternResponse>> {
    return this.http.post<PageResponse<InternResponse>>(`${this.baseUrl}/search`, request);
  }

  searchInternshipSessions(request: any = {}): Observable<PageResponse<any>> {
    return this.http.post<PageResponse<any>>(`${this.sessionUrl}/search`, request);
  }

  getIntern(id: string): Observable<InternResponse> {
    return this.http.get<InternResponse>(`${this.baseUrl}/${id}`);
  }

  deleteIntern(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  createIntern(request: InternRequest): Observable<InternResponse> {
    return this.http.post<InternResponse>(this.baseUrl, request);
  }

  updateIntern(id: string, request: InternRequest): Observable<InternResponse> {
    return this.http.put<InternResponse>(`${this.baseUrl}/${id}`, request);
  }
}
