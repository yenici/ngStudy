import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckersComponent } from './checkers.component';

describe('CheckersComponent', () => {
  let component: CheckersComponent;
  let fixture: ComponentFixture<CheckersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
