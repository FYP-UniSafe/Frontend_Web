import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellingComponent } from './counselling.component';

describe('CounsellingComponent', () => {
  let component: CounsellingComponent;
  let fixture: ComponentFixture<CounsellingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellingComponent],
    });
    fixture = TestBed.createComponent(CounsellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
