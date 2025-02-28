import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3pgComponent } from './d3pg.component';

describe('D3pgComponent', () => {
  let component: D3pgComponent;
  let fixture: ComponentFixture<D3pgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3pgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(D3pgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
