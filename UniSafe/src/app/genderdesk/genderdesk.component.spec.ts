import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderdeskComponent } from './genderdesk.component';

describe('GenderdeskComponent', () => {
  let component: GenderdeskComponent;
  let fixture: ComponentFixture<GenderdeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenderdeskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenderdeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
