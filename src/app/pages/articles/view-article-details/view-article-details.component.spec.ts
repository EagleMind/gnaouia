import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArticleDetailsComponent } from './view-article-details.component';

describe('ViewArticleDetailsComponent', () => {
  let component: ViewArticleDetailsComponent;
  let fixture: ComponentFixture<ViewArticleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewArticleDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewArticleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
