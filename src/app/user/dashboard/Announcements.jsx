import Card from "./Card";
export default function Announcements() {
  return (
    <>
      <section className="relative w-full">
        <h3
          className="
            text-base sm:text-lg font-semibold mb-3 sm:mb-4 
            text-gray-700 dark:text-gray-200
            tracking-wide
          "
        >
          Announcements
        </h3>

        <Card>
          <p className="text-[13px] sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">

            🎉 Welcome to 
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {" "}InstantSMM
            </span>
            ! Get the best social media services at lightning speed.
            <br />

            💳 Add funds to your account and start placing orders instantly.
            <br />

            📩 Need help? Visit our{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200 underline-offset-2 hover:underline cursor-pointer">
              Support
            </span>{" "}
            section.
          </p>
        </Card>
      </section>
    </>
  );
}
