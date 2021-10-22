import simpleAnalyticsPlugin from "@analytics/simple-analytics";
import Analytics from 'analytics';

export const analytics = Analytics({
    app: 'gazebo-web',
    plugins: [simpleAnalyticsPlugin({ customDomain: 'sa.laurentsenta.com' })]
})
