

const RatingStars = ({ratingNumber}) =>{

    const filledStars = Math.floor(ratingNumber); //number of filled stars
    const stars = [];

    //push filled stars
    for (let i = 0; i < filledStars; i++) {
        stars.push(
        <img
            key={i}
            src="/filled-star-image.svg"
            className="star filled-star"
        />
        );
    }

    //push unfilled stars (total stars - filled stars)
    for (let i = filledStars; i < 5; i++) {
        stars.push(
        <img
            key={i}
            src="/unfilled-star-image.svg" 
            alt="Unfilled Star"
            className="star unfilled-star"
        />
        );
    }

    return <div className="rating-stars">{stars}</div>;

};

export default RatingStars;
