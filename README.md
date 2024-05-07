# weatherapp
Hey !!! 

I will guide you through to the most simple installation possible for this amazing weather app !

Prereq -
please have a kubernetes cluster prepared ahead preferably  2 node cluster or more.
please run the helm command inside the txt file 

1. clone the wetherapp repository in to your local environment
2. then you may execute the following commands from the directory where the files are located :
"kubectl apply -f deployment.yaml                                                                                                                                                                                                                   ─╯
kubectl apply -f service.yaml
kubectl apply -f secret.yaml"
3. make sure the pod is up using the command "kubectl get pods " these pods are in the default namespace
4. in order to access the app using the command "kubectl port-forward my-pod 3000:3000 (you can use any other port for the remote port)
5. now you should be able to access the app and use it - try this url : http://localhost:3000/weather/haifa

my docker hub for images : https://hub.docker.com/r/noamika8/noam
