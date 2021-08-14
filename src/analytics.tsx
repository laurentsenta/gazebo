import simpleAnalyticsPlugin from "@analytics/simple-analytics";
import Analytics from 'analytics';

export const analytics = Analytics({
    app: 'notegarden-web',
    plugins: [simpleAnalyticsPlugin({ customDomain: 'sa.singulargarden.com' })]
})
