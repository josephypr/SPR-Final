package co.com.SPR.stepsdefinitions;

import java.util.List;
import co.com.SPR.models.CredencialesInicio;
import co.com.SPR.questions.ValidacionInicioSesion;
import co.com.SPR.tasks.Autenticarse;
import co.com.SPR.tasks.abrirSPR;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Entonces;
import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;
public class LoginPrestadorStepDefinitions {
    @Dado("^que el usuario se encuentra en la pagina de inicio de sesion de SPR como prestador$")
    public void queElUsuarioSeEncuentraEnLaPaginaDeInicioDeSesionDeSPRComoPrestador() {
        theActorInTheSpotlight().wasAbleTo(abrirSPR.lapagina());
    }


    @Cuando("^ingrese las credenciales correctas con el rol de prestador \\(usuario y contrasena\\)$")
    public void ingreseLasCredencialesCorrectasConElRolDePrestadorUsuarioYContrasena(List<CredencialesInicio> credenciales) {
        theActorInTheSpotlight().attemptsTo(Autenticarse.aute(credenciales));
    }

    @Entonces("^se debe verificar que el prestador haya sido autenticado correctamente y redirigido a su pagina de inicio de SPR$")
    public void seDebeVerificarQueElPrestadorHayaSidoAutenticadoCorrectamenteYRedirigidoASuPaginaDeInicioDeSPR() {
        theActorInTheSpotlight().should(seeThat((ValidacionInicioSesion.validacionInicioSesion())));
    }
}
