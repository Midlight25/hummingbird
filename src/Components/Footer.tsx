import React from 'react';

function Footer () {
  return (
    <div className="main-footer">
      <div className="container">
        <div className="row">


          {/* Column3 */}
          <div className="row">
            <h4>HummingBird</h4>
          </div>
        </div>
    
        <div className="row">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} Project Hummingbird | All rights reserved |
            Terms Of Service | Privacy
          </p>
        </div>
      </div>
    </div>
  );

}

export default Footer;