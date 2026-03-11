import React from 'react';

const SummaryPanel = ({ data }) => {
  const reqDoc = data?.requirements;
  const itinData = data?.itinerary?.days;
  const bookingsData = data?.bookings;

  return (
    <div className="summary-panel">
      <div className="summary-header">
        <h2>Trip Summary</h2>
      </div>
      <div className="summary-content">
        
        {/* Requirements Section */}
        <div className="summary-section" id="requirements-section">
          <h3><span className="step-num">1</span> Requirements</h3>
          <div className="content" id="requirements-content" style={{ color: reqDoc ? '#e2e8f0' : 'inherit' }}>
            {!reqDoc && "No travel requirements gathered yet."}
            {reqDoc && (
              <>
                <div className="req-item">
                  <span className="req-label">Trip:</span> 
                  <div>{reqDoc.trip?.origin?.city || '?'} ➔ {reqDoc.trip?.destination?.city || '?'} ({reqDoc.trip?.type || '?'})</div>
                </div>
                <div className="req-item">
                  <span className="req-label">Dates:</span> 
                  <div>{reqDoc.trip?.depart_date || '?'} to {reqDoc.trip?.return_date || 'N/A'}</div>
                </div>
                <div className="req-item">
                  <span className="req-label">Travelers:</span> 
                  <div>{reqDoc.traveler?.adults || 1} Adults, {reqDoc.traveler?.children || 0} Children</div>
                </div>
                <div className="req-item">
                  <span className="req-label">Budget:</span> 
                  <div>{reqDoc.budget?.total_amount || '?'} {reqDoc.budget?.total_currency || ''}</div>
                </div>
                <div className="req-item">
                  <span className="req-label">Interests:</span> 
                  <div>{(reqDoc.preferences?.interests || []).join(', ')}</div>
                </div>
                {reqDoc.flight_check?.outbound_result?.top_option && (
                  <div className="req-item">
                    <span className="req-label">Flight:</span> 
                    <div>{reqDoc.flight_check.outbound_result.top_option.carrier} {reqDoc.flight_check.outbound_result.top_option.flight_number} (${reqDoc.flight_check.outbound_result.top_option.price_usd})</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="summary-section" id="itinerary-section">
          <h3><span className="step-num">2</span> Itinerary</h3>
          <div className="content" id="itinerary-content" style={{ color: itinData && itinData.length > 0 ? '#e2e8f0' : 'inherit' }}>
            {(!itinData || itinData.length === 0) && "No itinerary generated yet."}
            {itinData && itinData.length > 0 && itinData.map((day, idx) => (
              <React.Fragment key={idx}>
                <div className="day-header">{day.date} - {day.city}</div>
                {day.activities.map((act, i) => (
                  <div key={i} className="activity-item">
                    {act.name} <em style={{ fontSize: '0.85em', opacity: 0.6, marginLeft: '6px' }}>{act.type}</em>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="summary-section" id="bookings-section">
          <h3><span className="step-num">3</span> Confirmed Bookings</h3>
          <div className="content" id="bookings-content">
            {(!bookingsData || (!bookingsData.flights && !bookingsData.hotels)) && "No bookings confirmed yet."}
            {bookingsData?.flights && (
              <div className="booking-item">Flight Confirmed: {bookingsData.flights.status} (#{bookingsData.flights.booking_id})</div>
            )}
            {bookingsData?.hotels && (
              <div className="booking-item">Hotel Confirmed: {bookingsData.hotels.status} (#{bookingsData.hotels.booking_id})</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SummaryPanel;
