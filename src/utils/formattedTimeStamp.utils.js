/**
 * Helper function to get a formatted timestamp for file naming or logging.
 * Format: YYYY-MM-DD_HH-MM-SS
 *
 * @returns {string} Formatted timestamp string
 */
module.exports = function getFormattedTimestamp() {
  const date = new Date(); // Get the current date and time

  // Extract and pad each component
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  // Return the formatted timestamp
  return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`;
};
