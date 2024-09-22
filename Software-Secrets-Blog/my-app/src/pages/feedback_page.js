import * as React from 'react';

import Feedbacks from '../components/feedback/feedback';

import feedback_banner from '../images/feedback_banner.jpg';

function Feedback() {

  setTimeout(() => {
    document.getElementById('banner_image').src = feedback_banner;
    document.getElementById("banner-header").innerHTML = '';
  }, 60);

  return (
    <div>
      <Feedbacks></Feedbacks>      
    </div>
  );
}
  
export default Feedback;