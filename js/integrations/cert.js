$(document).ready(function () {
    const certificateList = $("#certificateList");

    function fetchCertificates() {
        // Make an AJAX call to get certificates
        $.ajax({
            url: `${baseurl}/api/admin/get-all-certificates`,
            method: "GET",
            dataType: "json",
            success: function (response) {
                certificateList.empty(); // Clear existing list
                if (response.certificates) {
                    response.certificates.forEach(certificate => {
                        const card = `
                            
                                <div class="col-md-12 col-xl-12 col-lg-12 m-auto">
                                    <img src="${certificate.certificate_img_url}" class="img-fluid mb-1" alt="Certificate Image">
                                </div>
                            
                        `;
                        certificateList.append(card);
                    });
                }
            },
            error: function (error) {
                console.error("Error fetching certificates", error);
            }
        });
    }

    // Fetch and populate certificates on page load
    fetchCertificates();
    
    
});
