'use client'
import { useRouter } from "next/navigation";
import Accordion from "../../components/accordion";





export default function HelpPage() {
    const router = useRouter()

    const faqs = [
        {
            title: "What are the advantages of your service?",
            text: "If you go over your organisations or user limit, a member of the team will reach out about bespoke pricing. In the meantime, our collaborative features won't appear in accounts or users that are over the 100-account or 1,000-user limit.",
            active: false,
        },
        {
            title: "Are there any fees or commissions in addition to the monthly subscription?",
            text: "If you go over your organisations or user limit, a member of the team will reach out about bespoke pricing. In the meantime, our collaborative features won't appear in accounts or users that are over the 100-account or 1,000-user limit.",
            active: false,
        },
        {
            title: "You really don't charge per user? Why not?",
            text: "If you go over your organisations or user limit, a member of the team will reach out about bespoke pricing. In the meantime, our collaborative features won't appear in accounts or users that are over the 100-account or 1,000-user limit.",
            active: false,
        },
        {
            title: "What happens when I go over my monthly active limit?",
            text: "If you go over your organisations or user limit, a member of the team will reach out about bespoke pricing. In the meantime, our collaborative features won't appear in accounts or users that are over the 100-account or 1,000-user limit.",
            active: true,
        },
        {
            title: "Can your service help me understand how to work with my product?",
            text: "If you go over your organisations or user limit, a member of the team will reach out about bespoke pricing. In the meantime, our collaborative features won't appear in accounts or users that are over the 100-account or 1,000-user limit.",
            active: false,
        },
        {
            title: "Which third-party application do you integrate with?",
            text: "If you go over your organisations or user limit, a member of the team will reach out about bespoke pricing. In the meantime, our collaborative features won't appear in accounts or users that are over the 100-account or 1,000-user limit.",
            active: false,
        },
        {
            title: "I have another question!",
            text: "If you go over your organisations or user limit, a member of the team will reach out about bespoke pricing. In the meantime, our collaborative features won't appear in accounts or users that are over the 100-account or 1,000-user limit.",
            active: false,
        },
    ]
    return (
        <>


            <div className="flex-1 flex flex-col ">
                <div className="mb-6 bg-white">
                    <div className="flex flex-col my-6 items-center text-center" >
                        <h3 className=" text-2xl py-1">Help</h3>
                        <p className=" text-sm text-gray-400 py-1">Need some help? You can read FAQ below</p>

                    </div>
                </div>



                <div className="border mb-6 bg-white">
                    <div className="flex flex-col mb-6">
                        <div className="flex-col mt-6 py-2 items-center ">
                            <div className="mx-6">
                                <h3 className="text-lg py-1">FAQ</h3>
                                {faqs.map((faq, index) => (
                                    <Accordion key={index} title={faq.title} id={`faqs-${index}`} active={faq.active}>
                                        {faq.text}
                                    </Accordion>
                                ))}
                            </div>




                        </div>
                    </div>

                </div>





            </div>
        </>
    )
};