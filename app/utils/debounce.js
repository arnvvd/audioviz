/**
 * Debounce function
 *
 * @param {object} func Function to execute
 * @param {number} wait Duration on milliseconds
 */

export default function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
