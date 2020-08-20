/**
 * Class representing an achievement
 */

export class Achievement {

    /**
     * Name of the achievement
     */
    public title: string;
    /**
     * Description of the achievement
     */
    public description: string;
    /**
     * Date when achievement was gained
     */
    public date: string;
    /**
     * Points the achievement is worth. Needed for calculation of rank
     */
    public points: number;
    /**
     * Path to achievements picture
     */
    public img: string;

    constructor(title: string = '', description: string = '', date: string = '', points: number = 0,
                img?: string) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.points = points;
        this.img = img;
    }
}
