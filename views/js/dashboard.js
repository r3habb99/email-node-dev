document
  .getElementById('view-history-btn')
  .addEventListener('click', function () {
    const emailHistorySection = document.getElementById(
      'email-history-section'
    );
    const emailHistoryContent = document.getElementById(
      'email-history-content'
    );

    fetch('/email/email-history')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json(); // Parse JSON response
      })
      .then((data) => {
        if (data && Array.isArray(data.emails)) {
          emailHistorySection.style.display = 'block';

          if (data.emails.length > 0) {
            let tableContent = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Recipient</th>
                                    <th>Subject</th>
                                    <th>Sent At</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

            data.emails.forEach((email) => {
              tableContent += `
                            <tr>
                                <td>${email.to}</td>
                                <td>${email.subject}</td>
                                <td>${new Date(
                                  email.sentAt
                                ).toLocaleString()}</td>
                            </tr>
                        `;
            });

            tableContent += `
                        </tbody>
                    </table>
                    <div class="pagination">
                    `;

            if (data.currentPage > 1) {
              tableContent += `<a href="#" data-page="${
                data.currentPage - 1
              }" class="page-link">Previous</a>`;
            }

            for (let i = 1; i <= data.totalPages; i++) {
              tableContent += `<a href="#" data-page="${i}" class="page-link ${
                i === data.currentPage ? 'active' : ''
              }">${i}</a>`;
            }

            if (data.totalPages > data.currentPage) {
              tableContent += `<a href="#" data-page="${
                data.currentPage + 1
              }" class="page-link">Next</a>`;
            }

            tableContent += `</div>`;
            emailHistoryContent.innerHTML = tableContent;
          } else {
            emailHistoryContent.innerHTML = '<p>No emails found.</p>';
          }
        } else {
          emailHistoryContent.innerHTML =
            '<p>Unable to load email history.</p>';
        }
      })
      .catch((error) => {
        console.error('Error fetching email history:', error);
        emailHistoryContent.innerHTML = '<p>Error loading email history.</p>';
      });
  });

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('page-link')) {
    event.preventDefault();
    const page = event.target.getAttribute('data-page');

    fetch(`/email/email-history?page=${page}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json(); // Parse JSON response
      })
      .then((data) => {
        if (data && Array.isArray(data.emails)) {
          let tableContent = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Recipient</th>
                                    <th>Subject</th>
                                    <th>Sent At</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

          data.emails.forEach((email) => {
            tableContent += `
                            <tr>
                                <td>${email.to}</td>
                                <td>${email.subject}</td>
                                <td>${new Date(
                                  email.sentAt
                                ).toLocaleString()}</td>
                            </tr>
                        `;
          });

          tableContent += `
                        </tbody>
                    </table>
                    <div class="pagination">
                    `;

          if (data.currentPage > 1) {
            tableContent += `<a href="#" data-page="${
              data.currentPage - 1
            }" class="page-link">Previous</a>`;
          }

          for (let i = 1; i <= data.totalPages; i++) {
            tableContent += `<a href="#" data-page="${i}" class="page-link ${
              i === data.currentPage ? 'active' : ''
            }">${i}</a>`;
          }

          if (data.totalPages > data.currentPage) {
            tableContent += `<a href="#" data-page="${
              data.currentPage + 1
            }" class="page-link">Next</a>`;
          }

          tableContent += `</div>`;
          emailHistoryContent.innerHTML = tableContent;
        } else {
          emailHistoryContent.innerHTML = '<p>No emails found.</p>';
        }
      })
      .catch((error) => {
        console.error('Error fetching email history:', error);
        emailHistoryContent.innerHTML = '<p>Error loading email history.</p>';
      });
  }
});
