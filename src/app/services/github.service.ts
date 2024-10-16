import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private apiUrl = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  async pushCode(repo: string, filePath: string, content: string, token: string) {
    const url = `${this.apiUrl}/repos/${repo}/contents/${filePath}`;
    const headers = new HttpHeaders({
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      message: 'Add LeetCode solution',
      content: btoa(content) // Base64 encode the content
    };

    return this.http.put(url, body, { headers }).toPromise();
  }
}
