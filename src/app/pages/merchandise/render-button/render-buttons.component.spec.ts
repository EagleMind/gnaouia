import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderButtonsComponent } from './render-buttons.component';

describe('RenderButtonsComponent', () => {
  let component: RenderButtonsComponent;
  let fixture: ComponentFixture<RenderButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
