import { GetFooterManagementDetails } from "@/api/footer-details";

interface FooterChild {
  id?: number;
  name?: string;
  content?: string;
}

interface FooterSection {
  children?: FooterChild[];
}

export const Policy = () => {
  const { data } = GetFooterManagementDetails();

  const privacyPolicy = data?.flatMap((section: FooterSection) =>
    section.children?.filter(
      (child) =>
        child.name?.toLowerCase().includes("privacy") || child.id === 1
    ) ?? []
  )[0];

  // If no dynamic content, use static content for Android deployment
  const policyContent = privacyPolicy || {
    name: "Privacy Policy",
    content: `
      <h2>Privacy Policy</h2>
      <p><strong>Last Updated: December 24, 2025</strong></p>

      <p>This Privacy Policy describes how TipTapp ("we," "us," or "our") collects, uses, discloses, and safeguards your information when you use our mobile application and website (collectively, the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

      <h3>1. Information We Collect</h3>

      <h4>1.1 Personal Information</h4>
      <p>We collect personal information that you provide directly to us, including:</p>
      <ul>
        <li>Name (first and last)</li>
        <li>Email address</li>
        <li>Phone number and WhatsApp number</li>
        <li>Address, country, and city</li>
        <li>Date of birth</li>
        <li>Professional bio and profile information</li>
        <li>Profile picture</li>
      </ul>

      <h4>1.2 Payment Information</h4>
      <p>When you make payments through our Service, we collect:</p>
      <ul>
        <li>Payment method details (processed securely by Stripe)</li>
        <li>Bank account information for withdrawals</li>
        <li>Transaction history and amounts</li>
      </ul>

      <h4>1.3 Device and Usage Information</h4>
      <p>We automatically collect certain information when you use our Service:</p>
      <ul>
        <li>Device information (type, operating system, unique identifiers)</li>
        <li>IP address and location data</li>
        <li>App usage statistics and preferences</li>
        <li>Push notification tokens</li>
      </ul>

      <h4>1.4 Authentication Information</h4>
      <p>We collect information related to your account authentication:</p>
      <ul>
        <li>Login credentials</li>
        <li>Social media account information (Google, Facebook)</li>
        <li>Authentication tokens and session data</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>We use the collected information for the following purposes:</p>
      <ul>
        <li><strong>Service Provision:</strong> To provide, maintain, and improve our tipping services</li>
        <li><strong>Payment Processing:</strong> To process tips, withdrawals, and other financial transactions</li>
        <li><strong>Communication:</strong> To send you important updates, notifications, and customer support</li>
        <li><strong>Personalization:</strong> To customize your experience and provide relevant content</li>
        <li><strong>Security:</strong> To protect against fraud, unauthorized access, and security threats</li>
        <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
        <li><strong>Analytics:</strong> To understand how our Service is used and improve functionality</li>
      </ul>

      <h3>3. Information Sharing and Disclosure</h3>

      <h4>3.1 Service Providers</h4>
      <p>We share your information with third-party service providers who assist us in operating our Service:</p>
      <ul>
        <li><strong>Stripe:</strong> For payment processing and fraud prevention</li>
        <li><strong>Firebase:</strong> For push notifications and authentication</li>
        <li><strong>Keycloak:</strong> For user authentication and authorization</li>
        <li><strong>AWS S3:</strong> For secure file storage</li>
      </ul>

      <h4>3.2 Business Transfers</h4>
      <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</p>

      <h4>3.3 Legal Requirements</h4>
      <p>We may disclose your information if required by law, court order, or government request.</p>

      <h4>3.4 With Your Consent</h4>
      <p>We may share your information with your explicit consent for specific purposes.</p>

      <h3>4. Data Security</h3>
      <p>We implement appropriate technical and organizational security measures to protect your personal information:</p>
      <ul>
        <li>Encryption of sensitive data in transit and at rest</li>
        <li>Secure authentication and authorization systems</li>
        <li>Regular security audits and updates</li>
        <li>Access controls and monitoring</li>
        <li>Secure payment processing through certified providers</li>
      </ul>
      <p>However, no method of transmission over the internet or electronic storage is 100% secure.</p>

      <h3>5. Data Retention</h3>
      <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations:</p>
      <ul>
        <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deactivation</li>
        <li><strong>Transaction Records:</strong> Retained for financial reporting and compliance purposes (typically 7 years)</li>
        <li><strong>Device Information:</strong> Retained until you revoke permissions or delete your account</li>
        <li><strong>Marketing Data:</strong> Retained until you unsubscribe or request deletion</li>
      </ul>
      <p>You may request deletion of your data at any time, subject to legal and legitimate business requirements.</p>

      <h3>6. International Data Transfers</h3>
      <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses and adequacy decisions.</p>

      <h3>7. Your Rights</h3>
      <p>Depending on your location, you may have the following rights regarding your personal information:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of your personal information</li>
        <li><strong>Rectification:</strong> Request correction of inaccurate information</li>
        <li><strong>Erasure:</strong> Request deletion of your personal information</li>
        <li><strong>Portability:</strong> Request transfer of your data to another service</li>
        <li><strong>Restriction:</strong> Request limitation of processing</li>
        <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
        <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
      </ul>
      <p>To request deletion of your account and associated data, please contact us at privacy@tiptapthetippingapp.com with your account details. We will process your request within 30 days, subject to legal requirements.</p>

      <h3>8. Children's Privacy</h3>
      <p>Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.</p>

      <h3>9. Cookies and Tracking Technologies</h3>
      <p>We use cookies and similar technologies to enhance your experience:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for basic app functionality</li>
        <li><strong>Authentication Cookies:</strong> To keep you logged in securely</li>
        <li><strong>Analytics Cookies:</strong> To understand app usage and improve services</li>
      </ul>
      <p>You can control cookie settings through your device settings.</p>

      <h3>10. Third-Party Services</h3>
      <p>Our Service integrates with third-party services. Please review their privacy policies:</p>
      <ul>
        <li><strong>Google:</strong> For authentication and location services</li>
        <li><strong>Facebook:</strong> For social authentication</li>
        <li><strong>Stripe:</strong> For payment processing</li>
        <li><strong>Firebase:</strong> For notifications and analytics</li>
      </ul>

      <h3>11. Changes to This Privacy Policy</h3>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of the Service after changes become effective constitutes acceptance of the revised policy.</p>

      <h3>12. Contact Us</h3>
      <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
      <ul>
        <li><strong>Email:</strong> privacy@tiptapthetippingapp.com</li>
      </ul>

      <h3>13. Data Protection Officer</h3>
      <p>For GDPR-related inquiries, you can contact our Data Protection Officer at dpo@tiptapthetippingapp.com.</p>

      <p><strong>By using TipTapp, you acknowledge that you have read and understood this Privacy Policy.</strong></p>
    `
  };

  return (
    <div className="bg-primary-hex xl:min-h-screen pt-26 pb-80 ">
      <div className="flex mx-auto w-full justify-center md:p-20 xl:p-0">
        <div className="rounded-16 sm:bg-card min-h-[704px] max-h-[704px] max-w-[843px] w-full mx-70 overflow-y-auto lg:p-32 p-20 gap-y-24 mt-8 flex flex-col sm:shadow-xl">
          <h1 className="text-[28px] text-black font-[600]">{policyContent?.name}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: policyContent?.content || "No content available",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Policy;