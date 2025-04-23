import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.task.createMany({
    data: [
      {
        lsa: "KA",
        tsp: "Reliance",
        dotAndLea: "DoT",
        problemDescription: "Rcom plans to relocate the ISF Rack due to network configuration changes",
        status: "resolved",
        solutionProvided: "Site Inspected, and C-DoT ISF requirements provided for arrangement in the new space",
        remarks: "ISF Rack successfully relocated, and operations have resumed"
      },
      {
        lsa: "KR",
        tsp: "Vodafone",
        dotAndLea: "DoT & LEA",
        problemDescription: "LIS not responding for VIL target (xxxxxx6140)",
        status: "resolved",
        solutionProvided: "C-DoT requested TSP to resolve the E-Provisioning issue"
      },
      {
        lsa: "MB",
        tsp: "Telstra - IPLC",
        dotAndLea: "DoT",
        problemDescription: "Telstra -IPLC is facing file opening error and response is not being received for Telstra e-provisioning request",
        status: "resolved",
        solutionProvided: "septeir (LI)team  resolved the file-opening error & E-prov issue and iplc target Criteria got activated successsfully"
      },
      {
        lsa: "AP",
        tsp: "Vodafone",
        dotAndLea: "DRI",
        problemDescription: "LIS not responding for Roaming target (xxxxx-x6893) in TN-VIL",
        status: "resolved",
        solutionProvided: "Instructed TN-VIL to restore their LIS network and provide the target activation status",
        remarks: "Target successfully provisioned, interception active"
      },
      {
        lsa: "MB",
        tsp: "Orange - IPLC",
        dotAndLea: "DoT",
        problemDescription: "C-DoT team requested Orange - IPLC team to offer chennai Gate way LIVE IPLC testing",
        status: "In Process",
        solutionProvided: "Orange-IPLC is yet to offer the chennai gateway live IPLC testing"
      },
      {
        lsa: "MB",
        tsp: "Vodafone",
        dotAndLea: "DoT",
        problemDescription: "DOT-Mb reported that VIL-CSF Server is not reachable from VIL billing Server",
        status: "resolved",
        solutionProvided: "C-DoT resolved the issue by coordinating with VIL team and issue is resolved"
      },
      {
        lsa: "GJ",
        tsp: "Vodafone",
        dotAndLea: "DoT",
        problemDescription: "Target(0100500000031) is partially activated and LIS is not responding",
        status: "resolved",
        solutionProvided: "CDoT team requested TSP to resolve the  e-provisioning  issue"
      },
      {
        lsa: "MH",
        tsp: "None",
        dotAndLea: "Police",
        problemDescription: "Interception stopped from 04.07.2024 time 20.53 pm",
        status: "resolved",
        solutionProvided: "Oberved MP-RJIO server has in hung state and same has been resolved by server reboot.",
        remarks: "Verified the Server Log. Due to malfunction of PS process, server went on hung state."
      },
      {
        lsa: "KR",
        tsp: "None",
        dotAndLea: "Police",
        problemDescription: "KR Police provisioned 20 numbers. Interception not received for 4 numbers that are roaming.",
        status: "resolved",
        solutionProvided: "CDOT team contacted TN RJio and KA RJio, after which the RJio team pushed the interception data"
      },
      {
        lsa: "GJ",
        tsp: "Airtel",
        dotAndLea: "DoT",
        problemDescription: "Target(050030500000002)call direction is not received",
        status: "resolved",
        solutionProvided: "CDoT team  requested  TSP to send the call direction information in the IRI files"
      },
      {
        lsa: "KA",
        tsp: "Reliance Jio",
        dotAndLea: "DoT & LEA",
        problemDescription: "KR-Police target (xxxxx-66825) last seen in KA-RJio network, with coordinates showing Bangalore as the last location, No further interception received",
        status: "resolved",
        solutionProvided: "In KA-RJio network target is fully activated; no electronic provisioning issues, but target not using calls or data services",
        remarks: "Target status is frequently monitored for any activity & Informed to KR-Police"
      },
      {
        lsa: "MH",
        tsp: "",
        dotAndLea: "DoT",
        problemDescription: "SMS Notification Alert not received",
        status: "resolved",
        solutionProvided: "Plan Validity Expired",
        remarks: "Plan re-charged"
      },
      {
        lsa: "MH",
        tsp: "None",
        dotAndLea: "CBDT",
        problemDescription: "Delay in receiving records for two targets *90000 and *51488",
        status: "resolved",
        solutionProvided: "observed that problem with network latency and same has been informed to LEA"
      },
      {
        lsa: "MB",
        tsp: "GCXG-IPLC",
        dotAndLea: "DoT",
        problemDescription: "Meeting with GCXG-IPLC & their Veher LIM team held at C-DoT bangalore regarding CMS integration.",
        status: "resolved",
        solutionProvided: "C-DoT communicated miniutes of meeting with DOT-MB"
      },
      {
        lsa: "MH",
        tsp: "None",
        dotAndLea: "Police",
        problemDescription: "Regarding call contains are full of beep sound Reference CIN Numbers are: 2141663, 58172953",
        status: "resolved",
        solutionProvided: "Verified with BSNL, whatever we are receiving in E1-5, getting the beed sound of Voice, same has been informed to TSP and rectified and resolved by TSP with DOT Co-ordination",
        remarks: "Verifed in ISF server and found problem with one of the E1-5, same has been informed to DOT."
      },
      {
        lsa: "MH",
        tsp: "None",
        dotAndLea: "Police",
        problemDescription: "Regarding reset Password of CMS system of CID,MS,Pune user id 'mhpun01 to mhpun03'",
        status: "resolved",
        solutionProvided: "Enabled the User ID becomes active and reset the password and communicated to LEA"
      },
      {
        lsa: "GJ",
        tsp: "None",
        dotAndLea: "CBDT",
        problemDescription: "CBDT-Ahmedabad Team is not able to recover the data from Back-Up",
        status: "resolved",
        solutionProvided: "C-DOT team gave the backup procedure and resolved the issue",
        remarks: "CBDT Ahmedabad team is able to recover data succesfully from the backup"
      },
      {
        lsa: "KA",
        tsp: "None",
        dotAndLea: "DRI",
        problemDescription: "TSP not configured for a target Number",
        status: "resolved",
        solutionProvided: "Starting digits of number series updated in CMS Database",
        remarks: "DB updated for Airtel KA"
      },
      {
        lsa: "KA",
        tsp: "Airtel",
        dotAndLea: "Police",
        problemDescription: "Noise observed in the voice calls",
        status: "resolved",
        solutionProvided: "E1 lines are rewired in TSP location by AIRTEL",
        remarks: "E1 -1 and E1-2 were rewired"
      },
      {
        lsa: "MB",
        tsp: "None",
        dotAndLea: "DoT",
        problemDescription: "DOT-MB requested for the status update on faulty Pic-Card unit that's been sent for verification",
        status: "resolved",
        solutionProvided: "Status update is provided on faulty pic-card unit to DOT"
      },
      {
        lsa: "MH",
        tsp: "None",
        dotAndLea: "DoT",
        problemDescription: "SMS Notification Alert not received",
        status: "resolved",
        solutionProvided: "BSNL- Network Low Signal Strenght",
        remarks: "SIM changed to VIL"
      },
      {
        lsa: "MB",
        tsp: "None",
        dotAndLea: "DoT",
        problemDescription: "DOT requested C-DoT team to provide current status of CMS-integration with IPLC & ILD Operators",
        status: "resolved",
        solutionProvided: "C-DoT team to provided current status of CMS-integration with IPLC & ILD Operators to DOT-MB"
      },
      {
        lsa: "AP",
        tsp: "None",
        dotAndLea: "DoT",
        problemDescription: "Webbased Monitoring not working in 9.131 terminal",
        status: "resolved",
        solutionProvided: "resolved by installation of Google chrome and setting up the env variable of Windows system."
      },
      {
        lsa: "MH",
        tsp: "",
        dotAndLea: "DoT",
        problemDescription: "DOT person requested password reset for their CMS Opeartor.",
        status: "resolved",
        solutionProvided: "Password reset done by C-DoT team"
      },
      {
        lsa: "GJ",
        tsp: "BSNL",
        dotAndLea: "DoT",
        problemDescription: "Offline Monitoring window shows BSNL Target(xxxxxxx864)IMEI & IMSI as encrytpted.",
        status: "resolved",
        solutionProvided: "IMEI & IMSI is encrypted in Offline monitoring window post software Patch Installation",
        remarks: "C-DoT team gave clarification to DoT Ahmedabad"
      },
      {
        lsa: "MH",
        tsp: "None",
        dotAndLea: "Police",
        problemDescription: "Request for unblock users mhcri08",
        status: "resolved",
        solutionProvided: "Enabled the User ID becomes active and reset the password and comminucated to LEA"
      },
      {
        lsa: "KA",
        tsp: "BSNL",
        dotAndLea: "Police",
        problemDescription: "Target not activated",
        status: "resolved",
        solutionProvided: "LIS was not responding",
        remarks: "Notified the issue to TSP and  resolved the communication issue the ISF by TSP"
      },
      {
        lsa: "MH",
        tsp: "None",
        dotAndLea: "CBDT",
        problemDescription: "22 targets provisioned by MH CBDT. The same warrant has been resent to extend provisioning for another 3 days, as the targets have not yet been activated.",
        status: "resolved",
        solutionProvided: "The targets were initially rejected by DOT due to a mismatch between the provisioning start and stop times not aligning with the warrant. CBDT then corrected the warrant, and DOT subsequently approved it."
      },
      {
        lsa: "MB",
        tsp: "Citicom - ILD",
        dotAndLea: "DoT",
        problemDescription: "C-DoT Communicated with DOT that there is no further update from spectra team to proceed with CMS-Integration and they have not responded till date",
        status: "resolved",
        solutionProvided: "C-DoT requested DOT's intervention and directives whether to stop the follow-up with them and to stop the AMC-payment of ISF system and MPLS-VPN link charges"
      },
      {
        lsa: "KA",
        tsp: "Airtel",
        dotAndLea: "Police",
        problemDescription: "Targets ending with 90122, 97763, 59832, 92315, 62581 are inactive due to no response from LIS",
        status: "resolved",
        solutionProvided: "Instructed Airtel to restore their LIS network and provide the target activation status",
        remarks: "Target successfully provisioned, interception active"
      },
      {
        lsa: "TN",
        tsp: "None",
        dotAndLea: "CBI",
        problemDescription: "IMEI and SMS content are displaying as unreadable or garbled characters.",
        status: "resolved",
        solutionProvided: "C-DOT team upload a latest patch."
      },
      {
        lsa: "MB",
        tsp: "Airtel",
        dotAndLea: "DoT",
        problemDescription: "AIRTEL -call testing to verify missing 2G/3G CC issue",
        status: "resolved",
        solutionProvided: "C-DoT team carried-out the testing and provided the report and requested the AIRTEL team to resolve the missing CC issue"
      },
      {
        lsa: "MB",
        tsp: "None",
        dotAndLea: "CBI",
        problemDescription: "CBI team requested password reset for normal operator",
        status: "resolved",
        solutionProvided: "Password reset done by C-DoT team",
        remarks: "CBI Mumbai Team logged on to normal operator succesfully"
      },
      {
        lsa: "MB",
        tsp: "None",
        dotAndLea: "NCB",
        problemDescription: "NCB tean is not able to access the application",
        status: "resolved",
        solutionProvided: "C-DoT  team resolved the issue and NCB application is up.",
        remarks: "NCB Team confimed that they are able to log  on to their  LEMF application  & do Provisioning & Monitoring"
      }
    ]
  });
}

main()
  .then(() => console.log("Seeded successfully"))
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
