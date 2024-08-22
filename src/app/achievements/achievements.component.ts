import { Component, inject } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Achievement } from '../../models/achievements';
import { AchievementsService } from '../../services/achievements.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { User } from '../../models/user';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [NgForOf, NgClass, MatProgressBar, NgIf],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent {
  private achievementsService = inject(AchievementsService);
  private localStorageService = inject(LocalStorageService);

  /**
   * User achievements
   */
  achievements!: Achievement[];

  /**
   * User data
   */
  public actualUser!: User;

  /**
   * progress bar
   */
  progress = 0;

  constructor() {
    this.actualUser = this.localStorageService.getItem('user');
    this.achievementsService
      .getUserAchievements(37)
      .subscribe((achievements) => {
        this.achievements = achievements.items;
      });
  }

  calculateProgress(achievement: Achievement): number {
    return achievement.amount !== 0
      ? (achievement.made / achievement.amount) * 100
      : 0;
  }
}
