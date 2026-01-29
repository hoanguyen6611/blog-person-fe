import ImageShow from "@/components/Image";

export default function InfoPage() {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 font-sans text-gray-800 leading-relaxed">
        <ImageShow
            src="https://ik.imagekit.io/cjx1zgaos/IMG_58375.jpeg"
            alt="Avatar"
            className="rounded-full"
            width={300}
            height={300}
          />
        <h1 className="text-3xl font-bold text-blue-600">
          Nguyen Huy Hoa
        </h1>
  
        <section className="mt-4">
          <p>
            Date of Birth: 26 June 2001<br />
            Email: hoahuy2606@gmail.com<br />
            Phone: 0983807631<br />
            Location: Dong Nai, Vietnam
          </p>
        </section>
  
        <Section title="Career Objective">
          <p>
            Detail-oriented QA/Manual Tester with an IT background and hands-on
            experience in software testing through academic projects and internship.
            Proficient in test case design, functional, UI/UX, regression, and API
            testing using Postman. Seeking a position in manual and/or automated
            software testing to contribute to product quality and continuous
            improvement.
          </p>
        </Section>
  
        <Section title="Projects">
          <Project title="🎵 Music Streaming Platform">
            <li>Designed test cases for login, music playback, and playlist features.</li>
            <li>Performed functional testing and UI testing.</li>
            <li>Conducted API testing with Postman.</li>
          </Project>
  
          <Project title="📝 Personal Blog Platform">
            <li>Conducted UI/UX testing and content management features testing.</li>
            <li>Performed cross-browser testing (Chrome, Firefox).</li>
            <li>Applied regression testing after feature releases.</li>
            <li>Managed bugs with GitHub Issues.</li>
          </Project>
        </Section>
  
        <Section title="Work Experience">
          <Job
            title="On Job Training Manual Tester"
            company="FPT Software"
            time="Sep 2025 - Dec 2025"
          >
            <li>Designed and executed manual test cases based on requirements.</li>
            <li>Performed mobile testing on Android and iOS devices.</li>
            <li>Logged and tracked bugs with clear reproduction steps.</li>
            <li>Conducted regression testing after bug fixes.</li>
          </Job>
  
          <Job
            title="Frontend Developer Intern"
            company="Smartlog"
            time="July 2022 - Nov 2022"
          >
            <li>Tested web UI and functional features.</li>
            <li>Wrote and executed manual test cases.</li>
            <li>Performed manual API testing with Postman.</li>
            <li>Worked in Agile/Scrum environment.</li>
          </Job>
        </Section>
  
        <Section title="Education">
          <p>
            HCMC University of Technology and Education<br />
            Major: Information Technology
          </p>
        </Section>
  
        <Section title="Skills">
          <ul className="list-disc pl-6">
            <li>JavaScript / TypeScript</li>
            <li>SQL (Basic)</li>
            <li>API Testing</li>
            <li>GitHub</li>
            <li>JMeter</li>
          </ul>
        </Section>
      </main>
    );
  }
  
  /* ===== Reusable Components ===== */
  
  function Section({ title, children }: any) {
    return (
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-1">
          {title}
        </h2>
        <div className="mt-3">{children}</div>
      </section>
    );
  }
  
  function Project({ title, children }: any) {
    return (
      <div className="mt-4">
        <h3 className="font-semibold">{title}</h3>
        <ul className="list-disc pl-6 mt-1">{children}</ul>
      </div>
    );
  }
  
  function Job({ title, company, time, children }: any) {
    return (
      <div className="mt-4">
        <p className="font-semibold">{title}</p>
        <p className="italic text-sm text-gray-600">
          {company} • {time}
        </p>
        <ul className="list-disc pl-6 mt-1">{children}</ul>
      </div>
    );
  }