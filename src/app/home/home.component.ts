import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(private coursesService: CoursesService, private loadingService: LoadingService) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$ = this.coursesService
      .loadAllCourses()
      .pipe(map((courses) => courses.sort(sortCoursesBySeqNo)));

    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map((courses) => courses.filter((course) => course.category === "BEGINNER"))
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map((courses) => courses.filter((course) => course.category === "ADVANCED"))
    );
  }
}
