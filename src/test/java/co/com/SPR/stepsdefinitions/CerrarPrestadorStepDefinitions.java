package co.com.SPR.stepsdefinitions;

import co.com.SPR.models.CredencialesInicio;
import co.com.SPR.tasks.Autenticarse;
import co.com.SPR.tasks.CerrarSesionPrestador;
import co.com.SPR.tasks.abrirSPR;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Entonces;

import java.util.List;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;
public class CerrarPrestadorStepDefinitions {

    @Dado("^que el prestador ha accedido a la pantalla de inicio de sesión de SPR$")
    public void queElPrestadorHaAccedidoALaPantallaDeInicioDeSesiónDeSPR() {
        theActorInTheSpotlight().wasAbleTo(abrirSPR.lapagina());


    }


    @Cuando("^introduce las credenciales válidas \\(usuario y contrasena\\)$")
    public void introduceLasCredencialesVálidasUsuarioYContrasena(List<CredencialesInicio> credenciales) {
        theActorInTheSpotlight().attemptsTo(Autenticarse.aute(credenciales));

    }

    @Cuando("^el prestador accede al ícono de perfil y elige la opción para salir de la cuenta$")
    public void elPrestadorAccedeAlÍconoDePerfilYEligeLaOpciónParaSalirDeLaCuenta() {
        theActorInTheSpotlight().attemptsTo(CerrarSesionPrestador.cerrarpagina());

    }

    @Entonces("^su sesión se cerrará de forma satisfactoria$")
    public void suSesiónSeCerraráDeFormaSatisfactoria() {

    }

}
